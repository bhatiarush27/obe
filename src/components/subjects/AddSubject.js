import React, { useState, useEffect } from "react";
import axios from "axios";

const containerStyle = {
  maxWidth: "400px",
  margin: "0 auto",
  padding: "50px",
  backgroundColor: "white",
  textAlign: "center",
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

function AddSubject() {
  const [subjectDetails, setSubjectDetails] = useState({
    name: "",
    code: "",
    cos: [{ coCode: "CO1", level: "", description: "" }],
    coPoMapping: [],
    coPsoMapping: [],
    assignedFaculty: "", // New field to store the assigned faculty
  });
  const [POs, setPOs] = useState([]);
  const [PSOs, setPSOs] = useState([]);
  const [isCoPoMapped, setIsCoPoMapped] = useState(false);
  const [isCoPsoMapped, setIsCoPsoMapped] = useState(false);
  const [users, setUsers] = useState([]); // State to store fetched users
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch users when component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
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
    fetchData();
  }, []);

  const handleChange = (index, field, value, type) => {
    const updatedArray = [...subjectDetails[type]];
    updatedArray[index][field] = value;
    setSubjectDetails((prev) => ({ ...prev, [type]: updatedArray }));
  };

  const addComponent = (type) => {
    setSubjectDetails((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        type === "cos"
          ? { coCode: `CO${prev.cos.length + 1}`, level: "", description: "" }
          : { poCode: `CO${prev.pos.length + 1}`, description: "" },
      ],
    }));
    setIsCoPoMapped(false);
    setIsCoPsoMapped(false);
  };

  const removeComponent = (index, type) => {
    const updatedArray = [...subjectDetails[type]];
    updatedArray.splice(index, 1);
    setSubjectDetails((prev) => ({ ...prev, [type]: updatedArray }));
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

  const generateCoPoMapping = () => {
    const numCos = subjectDetails.cos.length;
    const numPos = POs.length;
    const coPoMapping = [];
    for (let i = 1; i <= numCos; i++) {
      const row = [];
      for (let j = 1; j <= numPos; j++) {
        row.push({
          label: `CO${i}-PO${j}`,
          value: 0,
        });
      }
      coPoMapping.push(row);
    }
    setSubjectDetails((prev) => ({ ...prev, coPoMapping }));
    setIsCoPoMapped(true);
  };

  const generateCoPsoMapping = () => {
    const numCos = subjectDetails.cos.length;
    const numPSOs = PSOs.length;
    const coPsoMapping = [];
    for (let i = 1; i <= numCos; i++) {
      const row = [];
      for (let j = 1; j <= numPSOs; j++) {
        row.push({
          label: `CO${i}-PSO${j}`,
          value: 0,
        });
      }
      coPsoMapping.push(row);
    }
    setSubjectDetails((prev) => ({ ...prev, coPsoMapping }));
    setIsCoPsoMapped(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5001/api/subjects", subjectDetails);
      alert("Subject added successfully");
      // Clear form fields after successful submission
      setSubjectDetails({
        name: "",
        code: "",
        cos: [{ coCode: "", level: "", description: "" }],
        coPoMapping: [],
        coPsoMapping: [],
        assignedFaculty: "",
      });
      setIsCoPoMapped(false);
      setIsCoPsoMapped(false);
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Add Subject</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <input
            type="text"
            placeholder="Name"
            value={subjectDetails.name}
            onChange={(e) =>
              setSubjectDetails((prev) => ({ ...prev, name: e.target.value }))
            }
            style={inputStyle}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <input
            type="text"
            placeholder="Subject Code"
            value={subjectDetails.code}
            onChange={(e) => {
              setSubjectDetails((prev) => ({ ...prev, code: e.target.value }));
            }}
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
            style={inputStyle}
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
                  <option value="">Select Level</option>
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
        {!isCoPoMapped ? (
          <button style={addButtonStyle} onClick={() => generateCoPoMapping()}>
            Generate CO-PO Mapping Matrix
          </button>
        ) : null}
        {isCoPoMapped ? (
          <div style={containerBorderStyle}>
            <h3>CO-PO Mapping</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `${POs.length}`,
              }}
            >
              {subjectDetails.coPoMapping.map((row, rowIndex) => (
                <div
                  style={{ display: "flex", width: "80%", margin: "0 auto" }}
                  key={rowIndex}
                >
                  {row.map((cell, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`} style={formGroupStyle}>
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
        ) : null}

        {!isCoPsoMapped ? (
          <button style={addButtonStyle} onClick={() => generateCoPsoMapping()}>
            Generate CO-PSO Mapping Matrix
          </button>
        ) : null}
        {isCoPsoMapped ? (
          <div style={containerBorderStyle}>
            <h3>CO-PSO Mapping</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `${PSOs.length}`,
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
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          style={isLoading ? disabledButtonStyle : buttonStyle}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default AddSubject;
