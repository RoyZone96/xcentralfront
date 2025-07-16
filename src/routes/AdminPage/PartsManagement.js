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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemValue, setNewItemValue] = useState("");

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
        return `/admin/blade/${id}`;
      case "ratchets":
        return `/admin/ratchet/${id}`;
      case "bits":
        return `/admin/bit/${id}`;
      default:
        return "";
    }
  };

  const getAddEndpoint = (tab) => {
    switch (tab) {
      case "blades":
        return "/admin/blade";
      case "ratchets":
        return "/admin/ratchet";
      case "bits":
        return "/admin/bit";
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

      console.log("Updating part:", { id, activeTab, payload });
      console.log(
        "Update endpoint:",
        `http://localhost:8080/${getUpdateEndpoint(activeTab, id)}`
      );

      const response = await axios.put(
        `http://localhost:8080${getUpdateEndpoint(activeTab, id)}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Update response:", response.data);
      setEditingId(null);
      setEditValue("");
      fetchParts(activeTab);
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(
        `Failed to update part: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleAddPart = async () => {
    if (!newItemValue.trim()) return;

    try {
      // Use 'bit' property for bits tab, 'name' for others
      const payload =
        activeTab === "bits" ? { bit: newItemValue } : { name: newItemValue };

      console.log("Adding part:", { activeTab, payload });
      console.log(
        "Add endpoint:",
        `http://localhost:8080/${getAddEndpoint(activeTab)}`
      );

      const response = await axios.post(
        `http://localhost:8080${getAddEndpoint(activeTab)}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Add response:", response.data);
      setNewItemValue("");
      setShowAddForm(false);
      fetchParts(activeTab);
    } catch (error) {
      console.error("Add error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(
        `Failed to add part: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAddForm(false);
    setNewItemValue("");
    setEditingId(null);
    setEditValue("");
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
            onClick={() => handleTabChange(type.key)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Add Part Form */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <button
            className="add-part-btn"
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : `Add New ${activeTab.slice(0, -1)}`}
          </button>
        </div>

        {showAddForm && (
          <div
            className="add-part-form"
            style={{
              background: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
              Add New {activeTab.slice(0, -1)}
            </h3>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                placeholder={`Enter ${activeTab.slice(0, -1)} name`}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onKeyPress={(e) => e.key === "Enter" && handleAddPart()}
              />
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={handleAddPart}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewItemValue("");
                }}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          renderTable(activeTab)
        )}
      </div>
    </div>
  );
}
