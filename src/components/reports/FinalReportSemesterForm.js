import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Semesters, Sessions } from "../../constants";

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

const SemesterReportForm = () => {
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
      navigate(`/final-report-semester/report?session=${selectedSession}&semester=${selectedSemester}`);
  };

  return (
    <div style={containerStyle}>
      <h2>Semester Report Form</h2>
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
        <button onClick={handleSubmit} style={buttonStyle}>
          Submit
        </button>
      ) : null}
    </div>
  );
};

export default SemesterReportForm;
