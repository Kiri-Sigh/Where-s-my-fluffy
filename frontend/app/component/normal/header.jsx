import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SmallModal from "./small_modal";
import { useAppContext } from "../../root_context";
import EditUserModal from "../modal/user_profile_edit_modal";
const Header = () => {
  const { setStateType } = useAppContext();
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [redirectP, setRedirectP] = useState({ path: "", idRequired: false });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    setUserId(storedUserId);
  }, [showModal]);

  const handleProtectedClick = (path, state, bool) => {
    path = `${path}`;
    setStateType(state);

    if (!userId) {
      setRedirectP({ path: path, idRequired: bool });
      setShowModal(true);
      setStateType(state);
    } else {
      navigate(path);
    }
  };

  const closeModal = () => setShowModal(false);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <SmallModal
        isOpen={showModal}
        onClose={closeModal}
        buttonPath={redirectP.path}
        idRequired={redirectP.idRequired}
      />
      <EditUserModal isOpen={isOpen} onClose={onClose} />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                className="h-10 w-10 rounded-full object-cover"
                src="http://static.photos/200x200/1"
                alt="Logo"
              />
              <span className="text-xl font-semibold text-indigo-600 whitespace-nowrap">
                Where’s my Fluffy
              </span>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <button
                  onClick={() => handleProtectedClick(`/map`, "MY_LIST", true)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  My List
                </button>
                <button
                  onClick={() =>
                    handleProtectedClick(`/map`, "PINNED_LIST", true)
                  }
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Pinned List
                </button>
                <button
                  onClick={() =>
                    handleProtectedClick(`/map`, "FIND_NEARBY", true)
                  }
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Find Nearby Pets
                </button>
                {/* <button
                  onClick={() =>
                    handleProtectedClick(`/notification`, "NOTIFICATION", true)
                  }
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Notification
                </button> */}
                <button
                  className="ml-4 p-1 rounded-full text-gray-700 hover:text-indigo-600 focus:outline-none"
                  onClick={() => {
                    if (userId) {
                      setIsOpen(true);
                    } else {
                      setShowModal(true);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
