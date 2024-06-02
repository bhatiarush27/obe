import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const containerStyle = {
  maxWidth: "400px",
  margin: "0 auto",
  padding: "50px",
  backgroundColor: "white",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "20px auto",
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

const SubjectReport = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = () => {
    if (selectedSubject) {
      navigate(`/final-subject-report/${selectedSubject}`);
    } else {
      alert("Please select a subject.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Subject Report</h2>
      <label htmlFor="subjectSelect">Select Subject:</label>
      <select
        id="subjectSelect"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select Subject</option>
        {subjects.map((subject) => (
          <option key={subject._id} value={subject._id}>
            {subject.name}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit} style={buttonStyle}>
        Submit
      </button>
    </div>
  );
};

export default SubjectReport;
