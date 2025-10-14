import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "react-feather";
import { useNavigation } from "react-router";

const API_URL = "http://localhost:3000/users";

const EditUserModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [lineId, setLineId] = useState("");
  const [insta, setInsta] = useState("");
  const [facebook, setFacebook] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigation();
  //   useEffect(() => {
  //     // Get user info from localStorage
  //     const storedUser = localStorage.getItem("user_id");
  //     if (storedUser) {
  //       setUser(storedUser);
  //     }
  //   }, [isOpen]);
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `http://localhost:3000/users/${storedUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data);
        console.log("setUser", res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNo(user.phone_no || "");
      setLineId(user.line_id || "");
      setInsta(user.insta || "");
      setFacebook(user.facebook || "");
      setPreviewImage(user.image_url || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone_no", phoneNo);
    formData.append("line_id", lineId);
    formData.append("insta", insta);
    formData.append("facebook", facebook);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");

      setSubmitting(true);
      const res = await axios.put(`${API_URL}/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse(res.data);
      setError(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-20 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Socials */}
          <div>
            <label className="block text-sm font-medium mb-1">Line ID</label>
            <input
              type="text"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              type="text"
              value={insta}
              onChange={(e) => setInsta(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg p-2"
            />
            {previewImage && (
              <div className="mt-2 w-24 h-24 relative">
                <img
                  src={previewImage}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
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
          </div>
        </form>

        {response && (
          <div className="text-green-600 mt-4">
            ✅ Updated successfully: {response.username}
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

export default EditUserModal;
