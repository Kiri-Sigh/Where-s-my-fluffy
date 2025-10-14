import { useState, useEffect } from "react";
import axios from "axios";
import ImageSliderGrid from "../modal/image_grid";
import ReportPetFoundModal from "./notify_pet_modal";
import { useAppContext } from "../../root_context";
import NotificationGrid from "../modal/notification_list_grid";
import EditListingModal from "../modal/edit_listing_modal";

const ListingDetails = ({ listingId, listingData, setPetNameNStatus }) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportIsOpen, setReportIsOpen] = useState(false);
  const { stateType } = useAppContext();
  const [owner, setOwner] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  // const { tokenC, setTokenC } = useAppContext();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/listings/${listingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setListing(res.data);
        setPetNameNStatus({ name: res.data.pet_name, status: res.data.status });

        if (res.data.user_id) {
          const userRes = await axios.get(
            `http://localhost:3000/users/${res.data.user_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setOwner(userRes.data);
        }
      } catch (error) {
        console.error("Error fetching listing or user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);
  useEffect(() => {
    console.log("stateype", stateType);
  }, []);
  const handleCloseReport = () => {
    setReportIsOpen(false);
  };
  if (loading) return <p>Loading listing...</p>;
  if (!listing) return <p>Listing not found</p>;

  const imageUrls = listing.images.map((img) => img.image_url);
  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        {imageUrls.length > 0 && <ImageSliderGrid images={imageUrls} />}

        {stateType == "MY_LIST" && (
          <button
            onClick={() => setEditOpen(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Edit Listing
          </button>
        )}
        <div className="mt-6 space-y-2">
          <h1 className="text-3xl font-bold">{listing.pet_name}</h1>

          <div>
            <span className="font-semibold">Description:</span>
            <span className="ml-4">{listing.description}</span>
          </div>

          <div>
            <span className="font-semibold">Bounty:</span>
            <span className="ml-4">${listing.bounty}</span>
          </div>

          <div>
            <span className="font-semibold">Location:</span>
            <span className="ml-4">{listing.expected_pet_location}</span>
          </div>

          <div>
            <span className="font-semibold">Created At:</span>
            <span className="ml-4">
              {new Date(listing.created_at).toLocaleDateString()}
            </span>
          </div>
          {owner && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-2">Owner Information</h2>
              <div className="flex items-center space-x-4">
                {owner.image && (
                  <img
                    src={owner.image}
                    alt={owner.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {"full name : "}
                    {owner.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {"phone number : "}
                    {owner.phone_no}
                  </p>
                  <p className="text-sm text-gray-600">
                    {"Email : "}
                    {owner.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {"facebook : "}
                    {owner.facebook}
                  </p>
                  <p className="text-sm text-gray-600">
                    {"instagram : "}
                    {owner.insta}
                  </p>
                  <p className="text-sm text-gray-600">
                    {"LineId : "}
                    {owner.line_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {"username : "}
                    {owner.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    Joined: {new Date(owner.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {stateType == "MY_LIST" && (
        <>
          <EditListingModal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            listing={listing}
            onListingUpdated={(updated) => setListing(updated)}
          />
          <NotificationGrid listingId={listing.id} />
        </>
      )}

      {stateType != "MY_LIST" && (
        <>
          <button
            onClick={() => {
              setReportIsOpen(true);
            }}
            whilehover={{ scale: 1.05 }}
            whiletap={{ scale: 0.95 }}
            className=" left-1 top-[80px] bg-yellow-400 text-white px-4 py-2 rounded-full shadow-md hover:bg-yellow-600 transition z-[10000] text-2xl"
            style={{ pointerEvents: "auto" }}
          >
            report to pet owner
          </button>

          <ReportPetFoundModal
            isOpen={reportIsOpen}
            onClose={handleCloseReport}
            listingId={listingId}
            userId={listing.user_id}
          />
        </>
      )}
    </>
  );
};

export default ListingDetails;
