import { useEffect, useState } from "react";
import feather from "feather-icons";
import { useAppContext } from "../root_context";
import { useNavigate } from "react-router";
import SmallModal from "./normal/small_modal";

const StarSurfLanding = () => {
  useEffect(() => {
    feather.replace();
  }, []);
  const { setStateType } = useAppContext();
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  return (
    <>
      <SmallModal
        isOpen={showModal}
        onClose={closeModal}
        buttonPath={redirectP.path}
        idRequired={redirectP.idRequired}
      />
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Hero */}
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-5xl font-bold text-gray-800 mb-6">
                Explore the Map
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                post missing pets or help the pet owner find their pets
                now!{" "}
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition duration-300"
                onClick={() =>
                  handleProtectedClick(`/map`, "PINNED_LIST", true)
                }
              >
                go view map
              </button>
            </div>

            {/* Right Hero */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://picsum.photos/id/237/600/900"
                alt="pet img"
                className="rounded-xl shadow-2xl w-full max-w-lg"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StarSurfLanding;
