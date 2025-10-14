import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import { useNavigate } from "react-router-dom";

const SmallModal = ({ isOpen, onClose, buttonPath, idRequired }) => {
  const navigate = useNavigate();

  useEffect(() => {
    feather.replace();
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10002] flex items-center justify-center modal-overlay backdrop-brightness-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-content bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn"
        style={{ animation: "fadeIn 0.3s ease-out" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <i data-feather="x"></i>
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <i
              data-feather="lock"
              className="w-12 h-12 mx-auto text-red-500 mb-4"
            ></i>
            <h3 className="text-2xl font-bold text-gray-800">
              Access Restricted
            </h3>
            <p className="text-gray-600 mt-2">
              You are not logged in. This action requires registration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                onClose();
                navigate(`/login?path=${buttonPath}&idRequired=${idRequired}`);
              }}
            >
              <i data-feather="log-in" className="w-4 h-4"></i> Login
            </button>
            <button
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                onClose();
                navigate(
                  `/register?path=${buttonPath}&idRequired=${idRequired}`
                );
              }}
            >
              <i data-feather="user-plus" className="w-4 h-4"></i> Register
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SmallModal;
