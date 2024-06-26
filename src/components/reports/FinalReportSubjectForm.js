import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Semesters, Sessions } from "../../constants";
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
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(!selectedSemester || !selectedSession) return;
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v2/subjects?session=${selectedSession}&semester=${selectedSemester}`
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [selectedSemester, selectedSession]);

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
      {selectedSemester && selectedSession ? (
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
      ) : null}
      <button onClick={handleSubmit} style={buttonStyle}>
        Submit
      </button>
    </div>
  );
};

export default SubjectReport;
