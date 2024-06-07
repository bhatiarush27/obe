import React, { useState, useEffect } from "react";
import { Semesters, Sessions } from "../../constants";
import axios from "axios";

const containerStyle = {
  // maxWidth: "400px",
  margin: "0 auto",
  padding: "50px",
  backgroundColor: "white",
  textAlign: "center",
};

const selectStyle = {
  width: "60%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "20px",
};

const addButtonStyle = {
  padding: "8px 16px",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "green",
  color: "white",
  cursor: "pointer",
  marginRight: "5px",
  marginTop: "10px",
};

const removeButtonStyle = {
  padding: "8px 16px",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "red",
  color: "white",
  cursor: "pointer",
  marginRight: "5px",
};

const AddAssignmentMarks = () => {
  const [formData, setFormData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [atMarks, setAtMarks] = useState("");
  const [taqMarks, setTaqMarks] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [file, setFile] = useState();

  const fileReader = new FileReader();

  const facultyId = localStorage.getItem("loggedInUserId") || "";

  useEffect(() => {
    if (!selectedSemester || !selectedSession) return;
    setSelectedSubject("");
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v2/subjects?session=${selectedSession}&semester=${selectedSemester}&facultyId=${facultyId}`
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [selectedSemester, selectedSession, facultyId]);

  console.log("arush22", formData);

  const handleAddData = () => {
    if (!enrollmentNumber) {
      alert("Add enrollment number.");
      return;
    }
    if (formData.some((data) => data.enrollmentNumber === +enrollmentNumber)) {
      alert("Enrollment number already exists.");
      return;
    }
    if (atMarks < 0 || atMarks > 10 || taqMarks < 0 || taqMarks > 10) {
      alert("Inconsistent data.");
      return;
    }

    const newData = {
      enrollmentNumber: +enrollmentNumber,
      atMarks: +atMarks,
      taqMarks: +taqMarks,
    };

    const updatedFormData = [...formData, newData].sort(
      (a, b) => a.enrollmentNumber - b.enrollmentNumber
    );

    setFormData(updatedFormData);
    setEnrollmentNumber("");
    setAtMarks("");
    setTaqMarks("");
  };

  const handleRemoveData = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        subjectId: selectedSubject,
        componentId: `ass-${selectedSubject}`,
        componentName: "ass",
        results: formData,
      };
      const response = await axios.get(
        `http://localhost:5001/api/assignments/${data.componentId}`
      );

      if (response.data) {
        const confirmUpdate = window.confirm(
          "An entry with the provided componentId already exists. Do you want to update it?"
        );

        if (confirmUpdate) {
          await axios.put("http://localhost:5001/api/assignments/update", data);
          alert("Result updated successfully!");
        } else {
          alert("Update cancelled by user.");
        }
      } else {
        await axios.post("http://localhost:5001/api/assignments", data);
        alert("Result added successfully!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const newData = csvRows?.map((row, index) => {
      const values = row.split(",");
      const enrollmentNumber = +values[0];
      const atMarks = +values[1];
      const taqMarks = +values[2];
      return { enrollmentNumber, atMarks, taqMarks };
    });

    let error = false;
    newData.forEach((dataRow) => {
      if (dataRow.atMarks > 10 || dataRow.taqMarks > 10) {
        alert(
          `Inconsistent marks data found for enrollment number - ${dataRow.enrollmentNumber}`
        );
        error = true;
        return;
      }
    });

    if (error) {
      error = false;
      return;
    }

    const existingEnrollmentNumbers = formData.map(
      (data) => data.enrollmentNumber
    );
    const newEnrollmentNumbers = newData.map((data) => data.enrollmentNumber);
    const duplicateEnrollmentNumbers = newEnrollmentNumbers.filter(
      (enrollmentNumber) => existingEnrollmentNumbers.includes(enrollmentNumber)
    );

    if (duplicateEnrollmentNumbers.length > 0) {
      alert(
        `Enrollment number(s) ${duplicateEnrollmentNumbers.join(
          ", "
        )} already exists in the form data. Aborting import.`
      );
      return;
    }

    const updatedFormData = [...formData, ...newData].sort(
      (a, b) => a.enrollmentNumber - b.enrollmentNumber
    );
    setFormData(updatedFormData);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Add Assignment Marks</h2>
      <select
        value={selectedSession}
        onChange={(e) => setSelectedSession(e.target.value)}
        style={selectStyle}
      >
        <option value="">Select Session</option>
        {Sessions.map((session) => (
          <option key={session} value={session}>
            {session}
          </option>
        ))}
      </select>
      <select
        value={selectedSemester}
        onChange={(e) => {
          setSelectedSemester(e.target.value);
        }}
        style={selectStyle}
      >
        <option value="">Select Semester</option>
        {Semesters.map((semester) => (
          <option key={semester} value={semester}>
            {semester}
          </option>
        ))}
      </select>
      {selectedSession && selectedSemester ? (
        <div>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select Subject</option>
            {subjects?.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {selectedSubject ? (
        <div
          style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
        >
          <h3>Enter Assignment Result:</h3>
          <div>
            <label htmlFor="enrollmentNumber">Enrollment Number:</label>
            <input
              type="text"
              id="enrollmentNumber"
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
              style={selectStyle}
            />
          </div>
          <div>
            <label htmlFor="atMarks">AT Marks:</label>
            <input
              type="text"
              id="atMarks"
              value={atMarks}
              onChange={(e) => setAtMarks(e.target.value)}
              style={selectStyle}
            />
          </div>
          <div>
            <label htmlFor="taqMarks">TAQ Marks:</label>
            <input
              type="text"
              id="taqMarks"
              value={taqMarks}
              onChange={(e) => setTaqMarks(e.target.value)}
              style={selectStyle}
            />
          </div>
        </div>
      ) : null}

      {selectedSubject ? (
        <button onClick={handleAddData} style={addButtonStyle}>
          Add
        </button>
      ) : null}

      {selectedSubject && formData.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h3>Added Data:</h3>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              border: "1px solid black",
            }}
          >
            <thead>
              <tr style={{ border: "1px solid black" }}>
                <th>Enrollment number</th>
                <th>AT Marks(Out of 10)</th>
                <th>TAQ Marks(Out of 10)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((data, index) => (
                <tr key={index}>
                  <td>{data.enrollmentNumber}</td>
                  <td>{data.atMarks}</td>
                  <td>{data.taqMarks}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveData(index)}
                      style={removeButtonStyle}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formData.length > 0 && (
        <button onClick={handleSubmit} style={addButtonStyle}>
          Submit
        </button>
      )}

      {selectedSubject ? (
        <div
          style={{ display: "flex", margin: "20px", justifyContent: "center" }}
        >
          <input
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleOnChange}
            style={addButtonStyle}
          />
          <button
            onClick={(e) => {
              handleOnSubmit(e);
            }}
            style={addButtonStyle}
          >
            IMPORT CSV
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AddAssignmentMarks;
