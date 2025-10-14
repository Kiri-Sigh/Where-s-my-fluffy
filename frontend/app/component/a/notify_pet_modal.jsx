import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "react-feather";

const API_URL = "http://localhost:3000/notifications/report-found";

const ReportPetFoundModal = ({ isOpen, onClose, listingId, userId }) => {
  const [token, setToken] = useState("");
  const [fromId, setFromId] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("user_id");
    if (savedToken) setToken(savedToken);
    if (savedUserId) setFromId(savedUserId);
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !userId || !fromId || !listingId) {
      alert("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("from_id", fromId);
    formData.append("listing_id", listingId);
    formData.append("message", message);
    images.forEach((img) => formData.append("images", img));

    try {
      setSubmitting(true);

      const res = await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponse(res.data);
      setError(null);

      setMessage("");
      setImages([]);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setMessage("");
    setImages([]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-20 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Report Pet Found</h2>
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
              Message
            </label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Enter any details about the found pet..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images (optional)
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
              className={`px-4 py-2 rounded-lg transition ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Submit Report
            </button>
          </div>
        </form>

        {response && (
          <div className="text-green-600 mt-4">
            ✅ Report sent successfully!
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

export default ReportPetFoundModal;
