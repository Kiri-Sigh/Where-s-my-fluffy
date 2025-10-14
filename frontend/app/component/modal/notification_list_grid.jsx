import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../../root_context";

const NotificationGrid = ({ listingId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { tokenC, setTokenC } = useAppContext();
  useEffect(() => {
    if (!listingId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/notifications/by-listing/${listingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [listingId]);

  if (loading) return <p>Loading notifications...</p>;
  if (notifications.length === 0)
    return <p>No notifications for this listing.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
        >
          <h3 className="font-semibold text-gray-800">{notif.message}</h3>
          <p className="text-sm text-gray-500">
            From: {notif.from?.name || "Anonymous"}
          </p>
          <p className="text-xs text-gray-400">
            Created: {new Date(notif.created_at).toLocaleString()}
          </p>

          {notif.image.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {notif.image.map((img) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  alt="notification"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationGrid;
