// import React, {useState, useEffect} from "react";
// import axios from 'axios';

//   const containerStyle = {
//     maxWidth: "900px",
//     margin: "0 auto",
//     padding: "50px",
//     backgroundColor: "white",
//     textAlign: "center",
//   };

// const SubjectsList = () => {
//   const [selectedSession, setSelectedSession] = useState("");
//   const [subjects, setSubjects] = useState("");

//   useEffect(() => {
//     const fetchSessionWiseSubjects = async () => {
//         try {
//           const response = await axios.get(`http://localhost:5001/api/v2/subjects?session=${selectedSession}`);
//           setSubjects(response.data);
//         } catch (error) {
//           console.error("Error fetching users:", error);
//         }
//       };
//       fetchSessionWiseSubjects()
//   }, [selectedSession])

//   console.log('arush2', subjects)

//   return (
//     <div style={containerStyle}>
//       <select
//         value={selectedSession}
//         onChange={(e) => setSelectedSession(e.target.value)}
//         style={selectStyle}
//       >
//         <option value="">Select a Session</option>
//         {['2022-2023','2023-2024'].map((session) => (
//           <option key={session} value={session}>
//             {session}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default SubjectsList;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
} from "@mui/material";
import { Sessions, Semesters } from "../../constants";

const selectStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "20px",
};

const buttonStyle = {
  height: "40px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const SubjectList = ({ permissions }) => {
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [subjectDetails, setSubjectDetails] = useState({
    name: "",
    code: "",
    session: selectedSession,
    cos: [{ coCode: "CO1", level: "", description: "" }],
    coPoMapping: [],
    coPsoMapping: [],
    assignedFaculty: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalTask, setModalTask] = useState("");
  const [users, setUsers] = useState([]); // State to store fetched users
  const [userDetails, setUserDetails] = useState({}); // State to store fetched users

  const navigate = useNavigate();

  const facultyUsername = localStorage.getItem("loggedInUsername") || null;

  const handleChange = (field, value) => {
    setSubjectDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (modalTask === "Add") {
        await axios.post("http://localhost:5001/api/subjects", subjectDetails);
        alert("Subject added successfully");
      } else {
        await axios.put(
          `http://localhost:5001/api/subjects/${subjectDetails.id}`,
          subjectDetails
        );
        alert("Subject edited successfully");
      }
      setSubjectDetails({
        name: "",
        code: "",
      });
      setIsModalOpen(false);
      setModalTask("");
      const response = await axios.get("http://localhost:5001/api/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = (subject, task) => {
    setSelectedSubject(subject); // Store the selected subject
    setSubjectDetails({
      name: subject.name,
      code: subject.code,
      id: subject._id,
    });
    setModalTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalTask("");
  };

  // const handleSubjectDelete = async (subject) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this subject?"
  //   );

  //   if (confirmDelete) {
  //     try {
  //       const response = await axios.delete(
  //         `http://localhost:5001/api/subjects/${subject._id}`
  //       );
  //       if (response.status === 200) {
  //         window.alert("Subject deleted successfully");
  //         const response = await axios.get(
  //           "http://localhost:5001/api/subjects"
  //         );
  //         setSubjects(response.data);
  //       } else {
  //         console.error("Failed to delete subject:", response.data.error);
  //         window.alert("Failed to delete subject");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting subject:", error);
  //       window.alert("Failed to delete subject");
  //     }
  //   }
  // };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        let userNameObj = {};
        console.log("arush344", response.data);
        response.data.forEach((resp) => (userNameObj[resp._id] = resp));
        setUserDetails(userNameObj);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setSubjects([]);
    setError("");
  }, [selectedSession, selectedSemester]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v2/subjects?session=${selectedSession}&semester=${selectedSemester}`
      );
      if (response.data.length === 0) {
        setError(
          "Unable to fetch subjects associated with the selected semester and session."
        );
        return;
      }
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  console.log("arush1212", userDetails);

  return (
    <Container maxWidth="md">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          margin: "20px auto",
        }}
      >
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
          onChange={(e) => setSelectedSemester(e.target.value)}
          style={selectStyle}
        >
          <option value="">Select Semester</option>
          {Semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
        <button style={buttonStyle} onClick={fetchSubjects}>
          Search
        </button>
      </div>

      <div style={{ color: "red" }}>{error}</div>

      {subjects.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Subject List</h3>
          {permissions.includes("subjectActionsAdd") ? <button style={buttonStyle} onClick={() => navigate("/add-subject")}>
            Add Subject
          </button> : null}
        </div>
      ) : null}

      {subjects.length ? (
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject Name</TableCell>
                  <TableCell>Faculty Assigned</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject._id}>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>
                      {userDetails[subject.assignedFaculty].name}
                    </TableCell>
                    <TableCell>{subject.code}</TableCell>
                    <TableCell>
                      {userDetails[subject.assignedFaculty].username ===
                      facultyUsername ? (
                        <Button
                          onClick={() =>
                            navigate(
                              `/edit-subject?session=${selectedSession}&subjectId=${subject._id}`
                            )
                          }
                        >
                          Edit
                        </Button>
                      ) : null}
                      {/* <Button
                        onClick={() => handleSubjectDelete(subject)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "10px",
                        }}
                      >
                        Delete
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : null}
    </Container>
  );
};

export default SubjectList;
