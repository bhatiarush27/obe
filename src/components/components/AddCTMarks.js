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

const AddCTMarks = () => {
  const [formData, setFormData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState({});
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [marks, setMarks] = useState([]);
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [currentComponent, setCurrentComponent] = useState({});
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [file, setFile] = useState();
  // const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const facultyId = localStorage.getItem('loggedInUserId') || '';

  useEffect(() => {
    if (!selectedSemester || !selectedSession) return;
    setSelectedSubject('');
    setFormData([]);
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
    const fetchComponents = async () => {
      setSelectedComponent('');
      if (selectedSubject) {
        try {
          const selectedSubDetails = subjects?.find(
            (sub) => sub._id === selectedSubject
          );
          setSelectedSubjectDetails(selectedSubDetails);
          const subjectId = selectedSubject;
          const response = await axios.get(
            `http://localhost:5001/api/v2/components/${subjectId}?session=${selectedSession}&semester=${selectedSemester}`
          );
          setComponents(response.data);
        } catch (error) {
          console.error("Error fetching components:", error);
        }
      }
    };
    fetchComponents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject]);

  useEffect(() => {
    const fetchComponent = async () => {
      if (selectedSubject && selectedComponent) {
        try {
          const currComponent = components?.filter(
            (component) => component._id === selectedComponent
          );
          setCurrentComponent(currComponent[0]);
          setMarks(Array(currComponent[0].questions?.length).fill(""));
        } catch (error) {
          console.error("Error fetching components:", error);
        }
      }
    };

    fetchComponent();
  }, [selectedSubject, selectedComponent]);

  const handleAddData = () => {
    if (!enrollmentNumber) {
      alert("Add enrollment number.");
      return;
    }
    if (formData.some((data) => data.enrollmentNumber === +enrollmentNumber)) {
      alert("Enrollment number already exists.");
      return;
    }
    for (let i = 0; i < marks?.length; i++) {
      if (marks[i] > currentComponent.questions[i].maxMarks) {
        alert("Inconsistent data!");
        return;
      }
    }
    const newData = {
      enrollmentNumber: +enrollmentNumber,
      marks: marks.map((mark, index) => ({
        question: currentComponent.questions[index].questionNumber,
        maxMarks: currentComponent.questions[index].maxMarks,
        attempted: !(mark === "-"),
        obtainedMarks: mark !== "-" ? +mark || 0 : 0,
      })),
      totalMarks: marks.reduce((total, mark) => {
        console.log("arushu", mark);
        const marks = mark !== "-" ? +mark || 0 : 0;
        return total + marks;
      }, 0),
    };

    const updatedFormData = [...formData, newData].sort(
      (a, b) => a.enrollmentNumber - b.enrollmentNumber
    );

    setFormData(updatedFormData);
    setEnrollmentNumber("");
    setMarks(Array(currentComponent.questions?.length).fill(""));
  };

  const handleRemoveData = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        componentId: `${currentComponent.componentName}-${selectedSubject}`,
        subjectId: selectedSubject,
        componentName: currentComponent.componentName,
        session: selectedSession,
        semester: selectedSemester,
        results: formData,
      };
      const response = await axios.get(
        `http://localhost:5001/api/v2/results/${data.componentId}?session=${selectedSession}&semester=${selectedSemester}`
      );

      if (response.data) {
        const confirmUpdate = alert(
          "An entry with the provided componentId already exists"
        );

        // if (confirmUpdate) {
        //   await axios.put("http://localhost:5001/api/v2/results", data);
        //   alert("Result updated successfully!");
        // } else {
        //   alert("Update cancelled by user.");
        // }
      } else {
        await axios.post("http://localhost:5001/api/v2/results", data);
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

      const marks = values.slice(1).map((mark, index) => ({
        question: currentComponent?.questions[index]?.questionNumber,
        maxMarks: currentComponent?.questions[index]?.maxMarks,
        attempted: !(mark === "-"),
        obtainedMarks: mark !== "-" ? +mark || 0 : 0,
      }));

      return {
        enrollmentNumber,
        marks,
        totalMarks: marks.reduce(
          (total, mark) => total + mark.obtainedMarks,
          0
        ),
      };
    });

    console.log('arushtest', newData, currentComponent)

    let error = false;
    newData.forEach((dataRow) => {
      dataRow.marks.forEach((mark, i) => {
        if(mark.obtainedMarks > currentComponent.questions[i].maxMarks) {
          alert(
            `Inconsistent data found for enrollment number - ${dataRow.enrollmentNumber}`
          );
          error = true;
          return;
        }
      })
    })

    if(error) {
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
      <h2>Add Component Result</h2>
      <div>
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
        ) : null}
      </div>
      {selectedSubject && (
        <div>
          <select
            id="component"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select Components</option>
            {components?.map((component) => (
              <option key={component._id} value={component._id}>
                {component.componentName}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedComponent && (
        <div
          style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
        >
          <h3>Enter Enrollment Number:</h3>
          <input
            type="text"
            value={enrollmentNumber}
            onChange={(e) => setEnrollmentNumber(e.target.value)}
            style={selectStyle}
          />
          <h3>Enter Marks:</h3>
          {currentComponent?.questions?.map((question, index) => (
            <div key={index}>
              <label htmlFor={`question-${index}`}>
                {`Question ${index + 1} (Max Marks: ${question.maxMarks}): `}
              </label>
              <input
                type="text"
                id={`question-${index}`}
                value={marks[index]}
                onChange={(e) => {
                  const updatedMarks = [...marks];
                  updatedMarks[index] = e.target.value;
                  setMarks(updatedMarks);
                }}
                style={selectStyle}
              />
            </div>
          ))}
        </div>
      )}

      {selectedComponent ? (
        <button onClick={handleAddData} style={addButtonStyle}>
          Add
        </button>
      ) : null}
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
                <th>Enrollment number</th>
                {currentComponent?.questions?.map((question, index) => (
                  <th key={index}>{`Question ${index + 1} (${
                    question.maxMarks
                  }marks)(${question.co})`}</th>
                ))}
                <th>{`Total marks (${currentComponent.totalMarks} marks)`}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((data, index) => (
                <tr key={index}>
                  <td>{data.enrollmentNumber}</td>
                  {data.marks.map((mark, i) => (
                    <td key={i}>{mark.obtainedMarks}</td>
                  ))}
                  <td>
                    {data.marks.reduce(
                      (total, mark) => total + mark.obtainedMarks,
                      0
                    )}
                  </td>
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
      {selectedComponent ? (
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

export default AddCTMarks;
