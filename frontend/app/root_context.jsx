// app/context/AppContext.tsx
import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState("FIND_LIST");
  const [stateType, setStateType] = useState("FIND_NEARBY");
  const [tokenC, setTokenC] = useState(null);

  const [idParam, setIdParam] = useState({ userId: "", listId: "" });
  const [marker, setMarker] = useState({});
  const [landmarkArr, setLandmarkArr] = useState([]);
  const [listArr, setListArr] = useState([]);
  const [filter, setFilter] = useState({
    minBounty: "",
    maxBounty: "",
    radius: "",
    petType: "",
    status: "",
  });
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const value = {
    state,
    tokenC,
    setTokenC,
    setState,
    idParam,
    setIdParam,
    marker,
    setMarker,
    listArr,
    setListArr,
    landmarkArr,
    setLandmarkArr,
    filter,
    setFilter,
    setOpenFilterModal,
    openFilterModal,
    setStateType,
    stateType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
