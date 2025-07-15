import React, { useState, useEffect } from "react";
import axios from "axios";

const PART_TYPES = [
  { key: "blades", label: "Blade" },
  { key: "ratchets", label: "Ratchet" },
  { key: "bits", label: "Bit" },
];

export default function PartsManagement() {
  const [activeTab, setActiveTab] = useState("blades");
  const [parts, setParts] = useState({
    blades: [],
    ratchets: [],
    bits: [],
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchParts(activeTab);
    // eslint-disable-next-line
  }, [activeTab]);

  const getApiEndpoint = (tab) => {
    switch (tab) {
      case "blades":
        return "/blade_parts/bladelist";
      case "ratchets":
        return "/ratchets/ratchetlist";
      case "bits":
        return "/bittype/bitlist";
      default:
        return "";
    }
  };

  const getUpdateEndpoint = (tab, id) => {
    switch (tab) {
      case "blades":
        return `/blade_parts/${id}`;
      case "ratchets":
        return `/ratchets/${id}`;
      case "bits":
        return `/bittype/${id}`;
      default:
        return "";
    }
  };

  const fetchParts = async (tab) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080${getApiEndpoint(tab)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let data = [];
      if (tab === "blades") {
        data =
          response.data.blade_parts ||
          (Array.isArray(response.data) ? response.data : []);
      }
      if (tab === "ratchets") {
        data =
          response.data.ratchets ||
          (Array.isArray(response.data) ? response.data : []);
      }
      if (tab === "bits") {
        // BitSelect component uses response.data directly for bits
        console.log("Full bits response:", response.data);
        console.log("Available keys:", Object.keys(response.data));

        // Use response.data directly like BitSelect does
        data = Array.isArray(response.data) ? response.data : [];
      }
      console.log("Used data for", tab, ":", data);
      setParts((prev) => ({ ...prev, [tab]: data }));
    } catch (error) {
      setParts((prev) => ({ ...prev, [tab]: [] }));
      console.error("Error fetching", tab, ":", error);
    }
    setLoading(false);
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleEditSave = async (id) => {
    try {
      // Use 'bit' property for bits tab, 'name' for others
      const payload =
        activeTab === "bits" ? { bit: editValue } : { name: editValue };
      await axios.put(
        `http://localhost:8080${getUpdateEndpoint(activeTab, id)}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingId(null);
      setEditValue("");
      fetchParts(activeTab);
    } catch (error) {
      alert("Failed to update part.");
    }
  };

  const renderTable = (tab) => {
    const data = parts[tab];
    return (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", color: "#888" }}>
                No {tab} found.
                {/* Show debug info for bits */}
                {tab === "bits" && (
                  <div style={{ fontSize: "0.8em", marginTop: 8 }}>
                    <strong>Debug:</strong>{" "}
                    <pre>{JSON.stringify(parts[tab], null, 2)}</pre>
                    <strong>Parts state:</strong> {parts[tab].length} items
                  </div>
                )}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>
                  {editingId === item.id ? (
                    <input
                      value={editValue}
                      onChange={handleEditChange}
                      style={{ width: "90%" }}
                    />
                  ) : // Use 'bit' property for bits tab, 'name' for others
                  tab === "bits" ? (
                    item.bit
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {editingId === item.id ? (
                    <>
                      <button
                        className="action-button"
                        style={{
                          background: "#28a745",
                          color: "#fff",
                          marginRight: 6,
                        }}
                        onClick={() => handleEditSave(item.id)}
                      >
                        Save
                      </button>
                      <button
                        className="action-button"
                        style={{ background: "#6c757d", color: "#fff" }}
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="action-button"
                      style={{ background: "#ffc107", color: "#212529" }}
                      onClick={() =>
                        handleEdit(
                          item.id,
                          tab === "bits" ? item.bit : item.name
                        )
                      }
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="part-management-section">
      <div className="parts-subtabs">
        {PART_TYPES.map((type) => (
          <button
            key={type.key}
            className={`subtab ${activeTab === type.key ? "active" : ""}`}
            onClick={() => setActiveTab(type.key)}
          >
            {type.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          renderTable(activeTab)
        )}
      </div>
    </div>
  );
}
