import React, { useEffect, useState } from "react";
import { useAppContext } from "../../root_context";

const CategoryGrid = ({ markers, setSelectedList }) => {
  const { setState } = useAppContext();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { tokenC, setTokenC } = useAppContext();
  useEffect(() => {
    if (!markers || markers.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }

    const fetchListings = async () => {
      setLoading(true);
      try {
        let token = localStorage.getItem("token");
        const results = await Promise.all(
          markers.map(async (marker) => {
            const res = await fetch(
              `http://localhost:3000/listings/by-location/${marker.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!res.ok) return null;
            const data = await res.json();
            return { marker, listing: data };
          })
        );

        setListings(results.filter((item) => item !== null));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [markers]);

  if (loading) return <p>Loading listings for markers...</p>;
  if (listings.length === 0) return <p>No listings found for markers.</p>;

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      {listings.map(({ marker, listing }) => (
        <div
          key={marker.id}
          className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
          onClick={() => {
            setSelectedList(listing.id);
            setState("LIST_DETAIL");
          }}
        >
          <img
            src={
              listing?.images?.[0]?.image_url || "https://placehold.co/600x400"
            }
            alt={listing.pet_name || "No Name"}
            className="w-24 h-24 object-cover rounded-lg shadow-sm"
          />
          <div>
            <h3 className="font-medium text-gray-800">
              {listing.pet_name || "No Name"}
            </h3>
            <p className="text-sm text-gray-600">{listing.description}</p>
            <p className="text-sm text-gray-600">{listing.status}</p>
            <p className="text-sm text-gray-600">
              Bounty: ${listing.bounty || 0}
            </p>
            {/* <p className="text-xs text-gray-400">
              Distance: {(marker.distance / 1000).toFixed(2)} km
            </p> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
