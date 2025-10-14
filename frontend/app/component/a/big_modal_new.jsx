import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router";
import ImageSliderGrid from "../modal/image_grid.jsx";

//
import CategoryGrid from "./pet_list_grid.jsx";
import { useAppContext } from "../../root_context.jsx";
import ListingDetails from "./pet_detail.jsx";
import axios from "axios";
const Modal1 = ({ isOpen, onClose, marker, userCoord, markers }) => {
  //   const [isOpen, setIsOpen] = useState(false);
  // const [modalTopic, setMdalTopic] = useState();
  //   console.log("modal marker", marker);
  //   console.log("modal isOpen", isOpen);
  //   console.log("modal onClose", onClose);
  const { state, setState } = useAppContext();
  const [selectedList, setSelectedList] = useState();
  const [petName, setPetNameNStatus] = useState({
    name: "Unknown",
    status: "Unknown",
  });
  const { setOpenFilterModal, stateType, tokenC, setTokenC } = useAppContext();
  useEffect(() => {
    setTokenC(localStorage.getItem("token"));
  }, []);
  useEffect(() => {
    if (marker) {
      const fetchListing = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3000/listings/by-location/${marker.id}`,
            {
              headers: {
                Authorization: `Bearer ${tokenC}`,
              },
            }
          );
          setSelectedList(res.data.id);
        } catch (error) {
          console.error("Error fetching listing:", error);
        } finally {
        }
      };

      fetchListing();
      setState("LIST_DETAIL");
    }
  }, [marker]);
  const modalVariants = {
    hidden: { y: "100vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      y: "100vh",
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <div className="p-6 flex-1 overflow-hidden relative"></div>
            <motion.div
              key="modal"
              id="modalContainer"
              className="fixed top-[10%] left-[10%] right-[10%] bottom-0 z-[9999] overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="modal-content bg-white flex flex-col h-full rounded-t-2xl shadow-2xl">
                {/* Header */}

                <div className="flex justify-between items-center p-6 ">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {state == "FIND_LIST" && "Find Neaby Lists"}
                    {state == "LIST_DETAIL" &&
                      `pet name - ${petName.name}  status - ${petName.status}`}
                  </h2>
                  <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-transform duration-200 hover:rotate-90"
                  >
                    ×
                  </button>
                  {state === "LIST_DETAIL" && (
                    <>
                      <motion.button
                        onClick={() => {
                          setState("FIND_LIST");
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute left-1 top-[80px] bg-indigo-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 transition z-[10000] text-2xl"
                        style={{ pointerEvents: "auto" }}
                      >
                        ←
                      </motion.button>
                      <motion.button
                        onClick={async () => {
                          try {
                            const storedUser = localStorage.getItem("user_id");

                            // const userId =
                            //   storedUser?.id || storedUser?.user_id;

                            if (!storedUser) {
                              alert("User not logged in!");
                              return;
                            }
                            await axios.post(
                              "http://localhost:3000/pinned/add",
                              {
                                user_id: storedUser,
                                list_id: selectedList,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              }
                            );
                            alert("Pinned successfully!");
                          } catch (error) {
                            console.error("Error pinning list:", error);
                            alert(
                              error.response?.data?.error || "Failed to pin"
                            );
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-1 top-[80px] bg-indigo-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 transition z-[10000]"
                        style={{ pointerEvents: "auto" }}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="#0091ff"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z"
                            fill="#dbfffe"
                          />
                        </svg>
                      </motion.button>
                    </>
                  )}

                  {(state == "FIND_LIST" ||
                    state == "PINNED_LIST" ||
                    state == "MY_LIST") && (
                    <>
                      <motion.button
                        onClick={() => {
                          setOpenFilterModal(true);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-1 top-[80px] bg-indigo-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 transition z-[10000] text-2xl"
                        style={{ pointerEvents: "auto" }}
                      >
                        filter
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Body */}

                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="p-6 flex-1 overflow-hidden relative">
                    <AnimatePresence
                      custom={state === "LIST_DETAIL" ? 1 : -1}
                      mode="wait"
                    >
                      {state === "FIND_LIST" && (
                        <motion.div
                          key="find_list"
                          custom={-1}
                          initial={{ x: "100%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: "-100%", opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <CategoryGrid
                            markers={markers}
                            setSelectedList={setSelectedList}
                          />
                        </motion.div>
                      )}

                      {state === "LIST_DETAIL" && (
                        <motion.div
                          key="list_detail"
                          custom={1}
                          initial={{ x: "100%", opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: "-100%", opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <ListingDetails
                            listingId={selectedList}
                            setPetNameNStatus={setPetNameNStatus}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Modal1;
