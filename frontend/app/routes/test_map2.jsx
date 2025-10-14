import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

import Modal1 from "../component/a/big_modal_new.jsx";
import PetBountyModal from "../component/a/modal2.jsx";
import { useAppContext } from "../root_context.jsx";
import FilterModal from "../component/modal/filter_modal.jsx";
export default function TestMap() {
  const { setListArr, state, setState, stateType, filter, tokenC, setTokenC } =
    useAppContext();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarker, setNewMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState({
    lat: 13.72866081160562,
    lon: 100.7776232743921,
  });
  const [originalZoom] = useState(25);
  const [modalOpen, setModalOpen] = useState(false);
  const [showListCreateModal, setShowListCreateModal] = useState(false);
  const [idParam, setIdParam] = useState();
  const [leafletMarker, setLeafletMarker] = useState(null);

  const [selectOnMap, setSelectOnMap] = useState(false);
  //state1 - after click finding pet in menu
  //2) - [SELECT_PIN]during pin location selection when setting listing location
  //3) -
  const API_URL = "http://localhost:3000/api/landmarks";

  // Fetch all landmarks on load
  // useEffect(() => {
  //   fetch(API_URL)
  //     .then((res) => res.json())
  //     .then((data) => setMarkers(data))
  //     .catch(console.error);
  // }, []);
  useEffect(() => {
    if (!center.lat || !center.lon) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        let data;
        console.log("Token:", tokenC);
        setTokenC(localStorage.getItem("token"));
        const userId = localStorage.getItem("user_id");
        if (stateType === "PINNED_LIST") {
          const res = await fetch(`http://localhost:3000/pinned/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          data = await res.json();

          const formattedMarkers = data.map((item) => ({
            id: item.location.id,
            name: item.pet_name || item.location?.name || "Unnamed",
            latitude: item.location?.latitude || item.latitude,
            longitude: item.location?.longitude || item.longitude,
            bounty: item.bounty,
            status: item.status,
            description: item.description,
          }));
          setMarkers(formattedMarkers);
        } else if (stateType === "MY_LIST") {
          {
            const res = await fetch(
              `http://localhost:3000/my-lists/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const data = await res.json();
            const formattedMarkers = data.map((item) => ({
              id: item.location.id,
              name: item.pet_name || item.location?.name || "Unnamed",
              latitude: item.location?.latitude || item.latitude,
              longitude: item.location?.longitude || item.longitude,
              bounty: item.bounty,
              status: item.status,
              description: item.description,
            }));
            setMarkers(formattedMarkers);
          }
        } else if (stateType === "FIND_NEARBY") {
          if (!filter) {
            const res = await fetch(
              `http://localhost:3000/api/landmarks/nearby?lat=${center.lat}&lon=${center.lon}&radius=10000`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            data = await res.json();
            setMarkers(data);
          } else {
            const queryParams = new URLSearchParams({
              lat: center.lat,
              lon: center.lon,
              radius: filter.radius || 10000,
              minBounty: filter.minBounty || "",
              maxBounty: filter.maxBounty || "",
              dateFrom: filter.dateFrom || "",
              dateTo: filter.dateTo || "",
              maxDaysOld: filter.maxDaysOld || "",
              petName: filter.petName || "",
              username: filter.username || "",
              pinnedByUserId: filter.pinnedByUserId || "",
            }).toString();
            let datafilter;
            const res = await fetch(
              `http://localhost:3000/api/landmarks/nearby-filter?${queryParams}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            data = await res.json();
            const formattedMarkers = data.map((item) => ({
              id: item.id,
              name: item.pet_name || item.location?.name || "Unnamed",
              latitude: item?.latitude || item.latitude,
              longitude: item?.longitude || item.longitude,
              bounty: item.bounty,
              status: item.status,
              description: item.description,
            }));
            setMarkers(formattedMarkers);
          }
        }
      } catch (error) {
        console.error("Error fetching markers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [center, stateType, filter]);

  // Initialize map
  useEffect(() => {
    import("leaflet").then((L) => {
      if (mapRef.current && !map) {
        const newMap = L.map(mapRef.current).setView(
          [center.lat, center.lon],
          25
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(newMap);

        newMap.on("click", (e) => {
          const { lat, lng } = e.latlng;
          setNewMarker({ latitude: lat, longitude: lng, name: "" });
        });

        setMap(newMap);
      }
    });
  }, [map]);

  // Add pins to map
  useEffect(() => {
    if (!map) return;

    import("leaflet").then((L) => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      markers.forEach((lm) => {
        L.marker([lm.latitude, lm.longitude])
          .addTo(map)
          .on("click", (e) => {
            handlePinClick(lm);
          });
      });
    });
  }, [map, markers]);
  useEffect(() => {
    console.log("selectedMarker changed:", selectedMarker);
  }, [selectedMarker]);
  const handlePinClick = (marker) => {
    setSelectedMarker({ ...marker });
    console.log("clicked marker", marker);
  };

  useEffect(() => {
    if (!map) return;

    if (selectedMarker) {
      console.log("marker yes");
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
    } else {
      console.log("marker no");

      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
    }
  }, [selectedMarker, map]);
  useEffect(() => {
    const hasOpenModal = selectedMarker || newMarker;
    document.body.style.overflow = hasOpenModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [selectedMarker, newMarker]);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);
  const handleResetZoom = () => {
    if (map) map.setView([center.lat, center.lon], originalZoom);
  };

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e) => {
      if (!selectOnMap) return;

      const { lat, lng } = e.latlng;
      const markerData = { latitude: lat, longitude: lng, name: "" };

      import("leaflet").then((L) => {
        if (leafletMarker) {
          map.removeLayer(leafletMarker);
        }

        const tempMarker = L.marker([lat, lng]).addTo(map);
        setLeafletMarker(tempMarker);
      });

      setSelectOnMap(false);
      setNewMarker(markerData);
      setShowListCreateModal(true);
    };

    map.on("click", handleMapClick);

    return () => map.off("click", handleMapClick);
  }, [map, selectOnMap]);
  return (
    <>
      <div
        ref={mapRef}
        style={{
          height: "90vh",
          width: "100%",
          borderRadius: "8px",
          position: "relative",
        }}
      />{" "}
      <button
        onClick={handleResetZoom}
        style={{
          position: "absolute",
          bottom: "80px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 14px",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        🔄 Rescale
      </button>
      <button
        onClick={() => setShowListCreateModal(true)}
        style={{
          position: "absolute",
          bottom: "140px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 14px",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        ℹ️ Create a Pet Search
      </button>
      <div
        onClick={() => setModalOpen(true)}
        className="fixed bottom-0 left-[10%] right-[10%] bg-white rounded-t-3xl shadow-md z-[9998] p-4 text-center cursor-pointer"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Tap to view details</p>
      </div>
      <Modal1
        isOpen={!!selectedMarker || modalOpen}
        onClose={() => {
          setSelectedMarker(null);
          setModalOpen(false);
        }}
        marker={selectedMarker}
        userCoord={center}
        state={state}
        changeState={setState}
        idParam={idParam}
        setIdParam={setIdParam}
        markers={markers}
      />
      <PetBountyModal
        isOpen={showListCreateModal}
        onClose={() => {
          setShowListCreateModal(false);
          setNewMarker(null);
          if (leafletMarker) {
            leafletMarker.remove();
            setLeafletMarker(null);
          }
        }}
        setSelectOnMap={setSelectOnMap}
        newMarker={newMarker}
        onListingCreated={(createdMarker) => {
          const exists = markers.some(
            (m) =>
              Math.abs(m.latitude - createdMarker.latitude) < 0.0001 &&
              Math.abs(m.longitude - createdMarker.longitude) < 0.0001
          );

          if (!exists) {
            setMarkers((prev) => [...prev, createdMarker]);

            import("leaflet").then((L) => {
              const pin = L.marker([
                createdMarker.latitude,
                createdMarker.longitude,
              ])
                .addTo(map)
                .on("click", () => handlePinClick(createdMarker));
            });
          }
        }}
      />
      <FilterModal />
    </>
  );
}
