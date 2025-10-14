import React, { useState, useEffect } from "react";
import { useAppContext } from "../../root_context";

const FilterModal = () => {
  const { filter, setFilter, setOpenFilterModal, openFilterModal } =
    useAppContext();
  const [localFilter, setLocalFilter] = useState(filter);

  useEffect(() => {
    if (openFilterModal) setLocalFilter(filter);
  }, [openFilterModal, filter]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalFilter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApply = () => {
    setFilter(localFilter);
    setOpenFilterModal(false);
  };

  const handleReset = () => {
    const resetFilter = {
      radius: 5000,
      minBounty,
      maxBounty,
      dateFrom,
      dateTo,
      maxDaysOld,
      petName,
      username,
      pinnedByUserId: false,
    };
    setLocalFilter(resetFilter);
    setFilter(resetFilter);
  };

  return (
    <>
      {openFilterModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4  z-[9999]"
          onClick={(e) =>
            e.target === e.currentTarget && setOpenFilterModal(false)
          }
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-blue-800 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Filter</h3>
              <button
                onClick={() => {
                  setOpenFilterModal(false);
                }}
                className="text-white hover:text-gray-200"
              >
                X
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Radius (miles)
                </label>
                <input
                  type="number"
                  name="radius"
                  value={localFilter.radius || ""}
                  onChange={handleChange}
                  placeholder="Enter radius"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Bounty Range ($)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Minimum
                    </label>
                    <input
                      type="number"
                      name="minBounty"
                      value={localFilter.minBounty || ""}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Maximum
                    </label>
                    <input
                      type="number"
                      name="maxBounty"
                      value={localFilter.maxBounty || ""}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      name="dateFrom"
                      value={localFilter.dateFrom || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      To
                    </label>
                    <input
                      type="date"
                      name="dateTo"
                      value={localFilter.dateTo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Max Days Since Post
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={localFilter.maxDaysOld || ""}
                  name="maxDaysOld"
                  onChange={handleChange}
                >
                  <option value="">Select days</option>
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last week</option>
                  <option value="30">Last month</option>
                  <option value="90">Last 3 months</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Pet Name
                </label>
                <input
                  type="text"
                  value={localFilter.petName || ""}
                  name="petName"
                  onChange={handleChange}
                  placeholder="Enter pet name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  User Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={localFilter.username || ""}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={!!localFilter.pinnedByUserId}
                  name="pinnedByUserId"
                  onChange={handleChange}
                  id="pinnedCheckbox"
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="pinnedCheckbox"
                  className="ml-2 text-gray-700 font-medium"
                >
                  Pinned by you
                </label>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={handleApply}
              >
                Apply Filters
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default FilterModal;
