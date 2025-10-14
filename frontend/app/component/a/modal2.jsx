import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "react-feather";

const API_URL = "http://localhost:3000/listings";

const PetBountyModal = ({
  isOpen,
  onClose,
  setSelectOnMap,
  newMarker,
  onListingCreated,
}) => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [petName, setPetName] = useState("");
  const [description, setDescription] = useState("");
  const [bounty, setBounty] = useState("");
  const [images, setImages] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [marker, setMarker] = useState();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (newMarker) {
      setMarker(newMarker);
    }
  }, [newMarker]);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("user_id");
    if (savedToken) setToken(savedToken);
    if (savedUserId) setUserId(savedUserId);
  }, []);
  useEffect(() => {}, [petName]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!petName || !bounty || !userId) {
      alert("Please fill in required fields");
      return;
    }

    const formData = new FormData();
    formData.append("pet_name", petName);
    formData.append("description", description);
    formData.append("bounty", bounty);
    formData.append("user_id", userId);

    if (marker) {
      formData.append("location_latitude", marker.latitude);
      formData.append("location_longitude", marker.longitude);
      formData.append("location_name", petName);
    }

    images.forEach((img) => formData.append("images", img));
    try {
      setSubmitting(true);

      const res = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      setResponse(data);
      setError(null);

      if (onListingCreated && marker) {
        onListingCreated({
          id: data.location.id,
          latitude: marker.latitude,
          longitude: marker.longitude,
          name: data.listing.pet_name || "Unnamed Pet",
        });
      }
      if (onListingCreated && marker) {
      }
      setPetName("");
      setDescription("");
      setBounty("");
      setImages([]);
      setMarker(null);

      onClose();
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {}, [response]);
  const handleCancel = () => {
    onClose();
    setResponse(null);
    setMarker(null);
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-20 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">New Bounty</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pet Name
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Fluffy"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Describe the pet..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bounty Amount ($)
            </label>
            <input
              type="number"
              value={bounty}
              onChange={(e) => setBounty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pet Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />

            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              setSelectOnMap(true);
            }}
            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Pick Location on Map
          </button>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2  rounded-lg  transition ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Post Bounty
            </button>
          </div>
        </form>

        {response && (
          <div className="text-green-600 mt-4">
            ✅ Successfully created: {response.pet_name}
          </div>
        )}
        {error && (
          <div className="text-red-600 mt-4">❌ {JSON.stringify(error)}</div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PetBountyModal;
