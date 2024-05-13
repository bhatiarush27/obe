import React, { useState, useEffect } from "react";
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

const AddExitSurveyMarks = () => {
  const [formData, setFormData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState({});
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [marks, setMarks] = useState([]);
  const [file, setFile] = useState();

  const fileReader = new FileReader();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/subjects");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const selectedSubDetails = subjects?.find(
        (sub) => sub._id === selectedSubject
      );
      setSelectedSubjectDetails(selectedSubDetails);
      setMarks(Array(selectedSubDetails.cos?.length).fill(""));
    }
  }, [selectedSubject, subjects]);

  const handleAddData = () => {
    // Create an object with the entered data and add it to the formData state
    if (!enrollmentNumber) {
      alert("Add enrollment number.");
      return;
    }
    const newData = {
      enrollmentNumber: +enrollmentNumber,
      marks
    };

    const updatedFormData = [...formData, newData];

    setFormData(updatedFormData);
    setEnrollmentNumber("");
    setMarks(Array(selectedSubjectDetails.cos?.length).fill(""));
  };

  const handleRemoveData = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      for(let j=0;j<formData.length;j++) {
        for (let i = 0; i < formData[j].marks?.length; i++) {
            if (formData[j].marks[i] > 5 || formData[j].marks[i] < 0) {
              alert("Inconsistent data!");
              return;
            }
          }
      }
      const data = {
        componentId: `ces-${selectedSubject}`,
        subjectId: selectedSubject,
        componentName: 'ces',
        results: formData.map((data, index) => ({
            enrollmentNumber: data.enrollmentNumber,
            totalMarks: 25,
            marks: data.marks.map((mark, ind) => ({
                question: selectedSubjectDetails.cos[ind].coCode,
                maxMarks: 5,
                attempted: true,
                obtainedMarks: mark
            }))
        })),
      };
      const response = await axios.get(
        `http://localhost:5001/api/results/${data.componentId}`
      );

      if (response.data) {
        const confirmUpdate = window.confirm(
          "An entry with the provided componentId already exists. Do you want to update it?"
        );

        if (confirmUpdate) {
          await axios.put("http://localhost:5001/api/results/update", data);
          alert("Result updated successfully!");
        } else {
          alert("Update cancelled by user.");
        }
      } else {
        await axios.post("http://localhost:5001/api/results", data);
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
      const marks = values.slice(1).map((mark, index) => (
        mark !== "-" ? +mark || 0 : 0
      ));
      return {
        enrollmentNumber,
        marks,
      };
    });

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
      <h2>Add Component Result</h2>
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
      {selectedSubject && (
        <div>
          <h3>Add Indirect Attainment(Out of 5)</h3>
          <input
            type="text"
            value={enrollmentNumber}
            onChange={(e) => {
              setEnrollmentNumber(+e.target.value);
            }}
            style={selectStyle}
            placeholder="Enrollment Number"
          />
          {selectedSubjectDetails.cos?.map((co, coIndex) => (
            <div key={coIndex}>
              <label>{`CO ${coIndex + 1}: `}</label>
              <input
                type="text"
                value={marks[coIndex]}
                onChange={(e) => {
                  const updatedMarks = [...marks];
                  updatedMarks[coIndex] = e.target.value;
                  setMarks(updatedMarks);
                }}
                style={selectStyle}
                placeholder={`Enter CO${coIndex + 1} marks`}
              />
            </div>
          ))}
          <button onClick={handleAddData} style={addButtonStyle}>
            Add Student
          </button>
        </div>
      )}
      {formData.length > 0 && (
        <div style={containerStyle}>
          {/* Existing code */}
          {formData.length > 0 && (
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
                    <th>Enrollment Number</th>
                    {selectedSubjectDetails.cos.map((co, index) => (
                      <th key={index}>CO {index + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formData.map((data, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{data.enrollmentNumber}</td>
                      {data.marks.map((mark, colIndex) => (
                        <td key={colIndex}>{mark}</td>
                      ))}
                      <td>
                        <button
                          onClick={() => handleRemoveData(rowIndex)}
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
        </div>
      )}
      {formData.length > 0 && (
        <button onClick={handleSubmit} style={addButtonStyle}>
          Submit
        </button>
      )}
      {selectedSubject && (
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
      )}
    </div>
  );
};

export default AddExitSurveyMarks;
