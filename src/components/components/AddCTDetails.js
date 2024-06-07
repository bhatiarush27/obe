import React, { useState, useEffect } from "react";
import axios from "axios";
import { Semesters, Sessions } from "../../constants";

const containerStyle = {
  // maxWidth: "400px",
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

const AddCTDetails = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState({});
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const facultyId = localStorage.getItem('loggedInUserId') || '';

  console.log('arushhhhh', facultyId)

  useEffect(() => {
    if (!selectedSemester || !selectedSession) return;
    const fetchSessionAndSemesterWiseSubjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v2/subjects?session=${selectedSession}&semester=${selectedSemester}&facultyId=${facultyId}`
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSessionAndSemesterWiseSubjects();
  }, [selectedSemester, selectedSession]);

  useEffect(() => {
    const selectedSubDetails = subjects?.find(
      (sub) => sub._id === selectedSubject
    );
    setSelectedSubjectDetails(selectedSubDetails);
  }, [selectedSubject, subjects]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionNumber: "", co: "", maxMarks: "", level: "" },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const updatedQuestions = questions.map((question) => ({
      ...question,
      maxMarks: +question.maxMarks,
    }));
    let totalMarks = 0;
    for (let i = 0; i < updatedQuestions.length; i++) {
      totalMarks += +updatedQuestions[i].maxMarks;
    }

    try {
      const componentData = {
        componentId: `${selectedComponent}-${selectedSubject}`,
        questions: updatedQuestions,
        session: selectedSession,
        totalMarks,
        fields: questions.map((question) => question.questionNumber),
        componentName: selectedComponent,
        subjectId: selectedSubject,
      };
      console.log("arush", componentData);
      await axios.post(`http://localhost:5001/api/components`, componentData);
      alert("Component details added successfully!");
      setSelectedComponent("");
      setSelectedSubject("");
      setSelectedSession("");
      setSelectedSession("");
      setQuestions([]);
    } catch (error) {
      alert("Error submitting component:");
      console.error("Error submitting data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Add CT's and SEE's question details </h2>
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
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={selectStyle}
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      ) : null}
      {selectedSubject && (
        <div>
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select Component</option>
            <option value="ct1">CT1(Class Test 1)</option>
            <option value="ct2">CT2(Class Test 2)</option>
            <option value="see">SEE(Semester End Examination)</option>
          </select>

          <h3>Question details</h3>
          {questions.map((question, index) => (
            <div
              key={index}
              style={{ border: "1px solid black", padding: "20px" }}
            >
              <div style={formGroupStyle}>
                <input
                  type="text"
                  placeholder="Question Number"
                  value={question.questionNumber}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "questionNumber",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>
              <div style={formGroupStyle}>
                <select
                  value={question.co}
                  onChange={(e) =>
                    handleQuestionChange(index, "co", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">Select CO</option>
                  {selectedSubjectDetails?.cos?.map((co) => (
                    <option key={co.coCode} value={co.coCode}>
                      {co.coCode} - {co.description}
                    </option>
                  ))}
                </select>
              </div>
              <div style={formGroupStyle}>
                <select
                  value={question.level}
                  onChange={(e) =>
                    handleQuestionChange(index, "level", e.target.value)
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
                  type="number"
                  placeholder="Max Marks"
                  value={question.maxMarks}
                  onChange={(e) =>
                    handleQuestionChange(index, "maxMarks", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                style={removeButtonStyle}
              >
                Remove Question
              </button>
            </div>
          ))}
          <button type="button" onClick={addQuestion} style={addButtonStyle}>
            Add Question
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={buttonStyle}
            disabled={
              !selectedSubject ||
              !selectedComponent ||
              questions.length === 0 ||
              submitting
            }
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddCTDetails;
