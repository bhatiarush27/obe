import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const containerStyle = {
  maxWidth: "400px",
  margin: "0 auto",
  padding: "50px",
  backgroundColor: "white",
  textAlign: "center",
};

const selectStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "20px",
};

const formGroupStyle = {
  width: "80%",
  margin: "0 auto",
  marginBottom: "25px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#ccc",
  cursor: "not-allowed",
};

const containerBorderStyle = {
  border: "1px solid #ccc",
  padding: "40px 0",
  borderRadius: "5px",
  marginBottom: "20px",
};

const addButtonStyle = {
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "10px 20px",
  margin: "20px 0",
  fontSize: "16px",
  cursor: "pointer",
};

const removeButtonStyle = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  margin: "20px 0",
};

function EditSubject() {
  const [subjectDetails, setSubjectDetails] = useState({
    name: "",
    code: "",
    cos: [],
    coPoMapping: [],
    coPsoMapping: [],
    assignedFaculty: "",
  });
  const [POs, setPOs] = useState([]);
  const [PSOs, setPSOs] = useState([]);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  console.log('arush1111', subjectDetails)

  const location = useLocation();

  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  const queryParams = getQueryParams(location.search);
  const session = queryParams.get("session");
  const subjectId = queryParams.get("subjectId");

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v2/subject?session=${session}&subjectId=${subjectId}`
        );
        console.log('response', response.data)
        setSubjectDetails(response.data);
        setSelectedSubject(subjectId);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchSubjectDetails();
  }, [session, subjectId]);

  console.log("arushSele", subjectDetails);

  useState(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchData = async () => {
      try {
        const response1 = await axios.get("http://localhost:5001/api/psos");
        const response2 = await axios.get("http://localhost:5001/api/pos");
        setPSOs(response1.data);
        setPOs(response2.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsers();
    fetchData();
  }, []);

  const handleChange = (index, field, value, type) => {
    if (field === "level" && value.trim() === "") {
      return;
    }

    const updatedArray = [...subjectDetails[type]];
    updatedArray[index][field] = value;
    setSubjectDetails((prev) => ({ ...prev, [type]: updatedArray }));
  };

  const addComponent = (type) => {
    const newComponent =
      type === "cos"
        ? {
            coCode: `CO${subjectDetails.cos.length + 1}`,
            level: "",
            description: "",
          }
        : { poCode: `CO${subjectDetails.pos.length + 1}`, description: "" };

    const coPoMappingLabels = Array(POs.length)
      .fill("")
      .map((_, index) => `CO${subjectDetails.cos.length + 1}-PO${index + 1}`);
    const coPsoMappingLabels = Array(PSOs.length)
      .fill("")
      .map((_, index) => `CO${subjectDetails.cos.length + 1}-PSO${index + 1}`);

    setSubjectDetails((prev) => ({
      ...prev,
      [type]: [...prev[type], newComponent],
      coPoMapping:
        type === "cos"
          ? [
              ...prev.coPoMapping,
              coPoMappingLabels.map((label) => ({ label, value: 0 })),
            ]
          : prev.coPoMapping,
      coPsoMapping:
        type === "cos"
          ? [
              ...prev.coPsoMapping,
              coPsoMappingLabels.map((label) => ({ label, value: 0 })),
            ]
          : prev.coPsoMapping,
    }));
  };

  const removeComponent = (index, type) => {
    const updatedArray = [...subjectDetails[type]];
    updatedArray.splice(index, 1);
    const updatedCoPoMappingArray = [...subjectDetails.coPoMapping];
    updatedCoPoMappingArray.splice(index, 1);
    const updatedCoPsoMappingArray = [...subjectDetails.coPsoMapping];
    updatedCoPsoMappingArray.splice(index, 1);
    setSubjectDetails((prev) => ({
      ...prev,
      [type]: updatedArray,
      coPoMapping: updatedCoPoMappingArray,
      coPsoMapping: updatedCoPsoMappingArray,
    }));
  };

  const handleChangeCoPoMapping = (rowIndex, colIndex, value) => {
    const updatedMapping = [...subjectDetails.coPoMapping];
    updatedMapping[rowIndex][colIndex] = {
      label: updatedMapping[rowIndex][colIndex].label,
      value,
    };
    setSubjectDetails((prev) => ({ ...prev, coPoMapping: updatedMapping }));
  };

  const handleChangeCoPsoMapping = (rowIndex, colIndex, value) => {
    const updatedMapping = [...subjectDetails.coPsoMapping];
    updatedMapping[rowIndex][colIndex] = {
      label: updatedMapping[rowIndex][colIndex].label,
      value,
    };
    setSubjectDetails((prev) => ({ ...prev, coPsoMapping: updatedMapping }));
  };

  const handleSubmit = async (e) => {
    console.log("arush", selectedSubject, subjectDetails);
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:5001/api/subjects/${selectedSubject}`,
        subjectDetails
      );
      alert("Subject updated successfully");
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("Error updating subject");
    }
    setIsLoading(false);
  };

  // const handleSubjectSelect = (subjectId) => {
  //   const selectedSubjectData = subjects.find(
  //     (subject) => subject._id === subjectId
  //   );
  //   setSelectedSubject(subjectId);
  //   setSubjectDetails(selectedSubjectData);
  // };

  return (
    <div style={containerStyle}>
      <h2>Edit Subject</h2>
      {selectedSubject ? (
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={subjectDetails.name}
              onChange={(e) =>
                setSubjectDetails({ ...subjectDetails, name: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="code">Code:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={subjectDetails.code}
              onChange={(e) =>
                setSubjectDetails({ ...subjectDetails, code: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <select
              value={subjectDetails.assignedFaculty}
              onChange={(e) => {
                setSubjectDetails((prev) => ({
                  ...prev,
                  assignedFaculty: e.target.value,
                }));
              }}
              style={selectStyle}
              required
            >
              <option value="">Select Faculty</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div style={containerBorderStyle}>
            <h3>Course Outcomes (COs)</h3>
            {subjectDetails.cos.map((co, index) => (
              <div key={index} style={{ padding: "20px 0" }}>
                <div style={formGroupStyle}>
                  <input
                    type="text"
                    placeholder="CO Code"
                    value={co.coCode}
                    onChange={(e) =>
                      handleChange(index, "coCode", e.target.value, "cos")
                    }
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <select
                    value={co.level}
                    onChange={(e) =>
                      handleChange(index, "level", e.target.value, "cos")
                    }
                    style={inputStyle}
                  >
                    <option value={null}>Select Level</option>
                    <option value="K1">K1</option>
                    <option value="K2">K2</option>
                    <option value="K3">K3</option>
                    <option value="K4">K4</option>
                    <option value="K5">K5</option>
                  </select>
                </div>
                <div style={formGroupStyle}>
                  <input
                    type="text"
                    placeholder="Description"
                    value={co.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value, "cos")
                    }
                    style={inputStyle}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeComponent(index, "cos")}
                  style={removeButtonStyle}
                >
                  Remove CO
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addComponent("cos")}
              style={addButtonStyle}
            >
              Add CO
            </button>
          </div>

          <div style={containerBorderStyle}>
            <h3>CO-PO Mapping</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${POs.length})`,
              }}
            >
              {subjectDetails.coPoMapping.map((row, rowIndex) => (
                <div
                  style={{ display: "flex", width: "80%", margin: "0 auto" }}
                  key={rowIndex}
                >
                  {row.map((cell, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`} style={formGroupStyle} padding={`${colIndex * 50}px`}>
                      <label>{cell.label}</label>
                      <select
                        value={
                          subjectDetails.coPoMapping[rowIndex][colIndex].value
                        }
                        onChange={(e) =>
                          handleChangeCoPoMapping(
                            rowIndex,
                            colIndex,
                            +e.target.value
                          )
                        }
                        style={inputStyle}
                      >
                        {[0, 1, 2, 3].map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div style={containerBorderStyle}>
            <h3>CO-PSO Mapping</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${PSOs.length})`,
                gap: "10px",
              }}
            >
              {subjectDetails.coPsoMapping.map((row, rowIndex) => (
                <div
                  style={{ display: "flex", width: "80%", margin: "0 auto" }}
                  key={rowIndex}
                >
                  {row?.map((cell, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`} style={formGroupStyle}>
                      <label>{cell.label}</label>
                      <select
                        value={
                          subjectDetails.coPsoMapping[rowIndex][colIndex].value
                        }
                        onChange={(e) =>
                          handleChangeCoPsoMapping(
                            rowIndex,
                            colIndex,
                            +e.target.value
                          )
                        }
                        style={inputStyle}
                      >
                        {[0, 1, 2, 3].map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={isLoading ? disabledButtonStyle : buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Save"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default EditSubject;
