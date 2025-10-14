import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "react-feather";

const API_URL = "http://localhost:3000/listings";

const EditListingModal = ({ isOpen, onClose, listing, onListingUpdated }) => {
  const [petName, setPetName] = useState("");
  const [description, setDescription] = useState("");
  const [bounty, setBounty] = useState("");
  const [status, setStatus] = useState("MISSING");
  // const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (listing) {
      setPetName(listing.pet_name);
      setDescription(listing.description);
      setBounty(listing.bounty);
      setStatus(listing.status || "MISSING");
    }
  }, [listing]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listing?.id) return;

    const payload = {
      pet_name: petName,
      description,
      bounty,
      user_id: listing.user_id,
      status,
    };

    try {
      setSubmitting(true);

      const res = await axios.put(`${API_URL}/${listing.id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResponse(res.data);
      onListingUpdated?.(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !listing) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-20 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Listing</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pet Name</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Bounty Amount ($)
            </label>
            <input
              type="number"
              value={bounty}
              onChange={(e) => setBounty(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Listing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="MISSING">Missing</option>
              <option value="FOUND">Found</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded-lg text-white transition ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>

        {response && (
          <div className="text-green-600 mt-4">
            ✅ Updated successfully: {response.pet_name}
          </div>
        )}
        {error && (
          <div className="text-red-600 mt-4">❌ {JSON.stringify(error)}</div>
        )}
      </div>
    </div>
  );
};

export default EditListingModal;
