// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import axios from "axios";
// import {
//   Container,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
// } from "@mui/material";

// const UsersView = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/api/users");
//         setUsers(response.data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         setError("Failed to fetch users");
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleUserDelete = async (userId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this user?"
//     );

//     if (confirmDelete) {
//       try {
//         const response = await axios.delete(`http://localhost:5001/api/users/${userId}`);
//         if (response.status === 200) {
//           setUsers(users.filter(user => user._id !== userId));
//           window.alert("User deleted successfully");
//         } else {
//           console.error("Failed to delete user:", response.data.error);
//           window.alert("Failed to delete user");
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//         window.alert("Failed to delete user");
//       }
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <h2>Users</h2>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Username</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell>{user.username}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>
//                 <Button onClick={() => navigate(`/edit-user`)}>
//                         Edit
//                       </Button>
//                   <Button
//                     onClick={() => handleUserDelete(user._id)}
//                     style={{
//                       backgroundColor: "red",
//                       color: "white",
//                       borderRadius: "10px",
//                     }}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default UsersView;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const buttonStyle = {
  height: "30px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const UsersView = ({permissions}) => {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: "",
    username: "",
    email: "",
    level: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState(""); // "Add" or "Edit"
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleModalOpen = (task, user = {}) => {
    setModalTask(task);
    setIsModalOpen(true);
    if (task === "Edit") {
      setSelectedUserId(user._id);
      setUserDetails({
        name: user.name,
        username: user.username,
        email: user.email,
        level: user.level,
      });
    } else {
      setUserDetails({
        name: "",
        username: "",
        email: "",
        level: "",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setUserDetails({
      name: "",
      username: "",
      email: "",
      level: "",
    });
    setSelectedUserId("");
    setModalTask("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (modalTask === "Add") {
        await axios.post("http://localhost:5001/api/users", userDetails);
        alert("User added successfully");
      } else {
        await axios.put(`http://localhost:5001/api/users/${selectedUserId}`, userDetails);
        alert("User updated successfully");
      }
      const response = await axios.get("http://localhost:5001/api/users");
      setUsers(response.data);
      handleModalClose();
    } catch (error) {
      console.error(`Error ${modalTask === "Add" ? "adding" : "updating"} user:`, error);
      alert(`Failed to ${modalTask === "Add" ? "add" : "update"} user`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5001/api/users/${userId}`);
        if (response.status === 200) {
          setUsers(users.filter((user) => user._id !== userId));
          window.alert("User deleted successfully");
        } else {
          console.error("Failed to delete user:", response.data.error);
          window.alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        window.alert("Failed to delete user");
      }
    }
  };

  const handleChange = (field, value) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="md">
      
      <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Users list</h3>
          {permissions.includes("addUser") ? <button style={buttonStyle} onClick={() =>handleModalOpen("Add")}>
            Add User
          </button> : null}
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Email</TableCell>
              {permissions.includes("userActions") ? <TableCell>Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.level}</TableCell>
                <TableCell>{user.email}</TableCell>
                {permissions.includes("userActions") ?<TableCell>
                 <Button onClick={() => handleModalOpen("Edit", user)}>Edit</Button>
                  <Button
                    onClick={() => handleUserDelete(user._id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "10px",
                      marginLeft: "10px",
                    }}
                  >
                    Delete
                  </Button>
                </TableCell> : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>{modalTask === "Add" ? "Add User" : "Edit User"}</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              value={userDetails.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Username"
              value={userDetails.username}
              onChange={(e) => handleChange("username", e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              value={userDetails.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="user-level-label">User Level</InputLabel>
              <Select
                labelId="user-level-label"
                value={userDetails.level}
                onChange={(e) => handleChange("level", e.target.value)}
              >
                <MenuItem value="">
                  <em>Select user-level</em>
                </MenuItem>
                {userLevels.map((user) => (
                  <MenuItem key={user.key} value={user.key}>
                    {`${user.name} - ${user.includes}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                backgroundColor: isLoading ? "#ccc" : "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginTop: "20px",
              }}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

const userLevels = [
  {
    key: "super_admin",
    name: "Super Admin",
    includes: "Head of the institute, or administrative body at Institute level",
  },
  {
    key: "admin",
    name: "Admin",
    includes: "Head of the department, or administrative body at Department level",
  },
  {
    key: "faculty",
    name: "Faculty",
    includes: "Professors, Ass. Professors, and various Faculties",
  },
];

export default UsersView;

