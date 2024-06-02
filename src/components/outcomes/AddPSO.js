import React, { useState, useEffect } from "react";
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

const buttonStyle = {
  height: "40px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const AddPSO = () => {
  const [psoDetails, setPsoDetails] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [psos, setPsos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPso, setSelectedPso] = useState(null);
  const [modalTask, setModalTask] = useState("");

  const handleChange = (field, value) => {
    setPsoDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (modalTask === "Add") {
        await axios.post("http://localhost:5001/api/psos", psoDetails);
        alert("PSO added successfully");
      } else {
        await axios.put(
          `http://localhost:5001/api/psos/${psoDetails.id}`,
          psoDetails
        );
        alert("PSO edited successfully");
      }
      // Clear form fields after successful submission
      setPsoDetails({
        name: "",
        description: "",
      });
      setIsModalOpen(false);
      setModalTask("");
      const response = await axios.get("http://localhost:5001/api/psos");
      setPsos(response.data);
    } catch (error) {
      console.error("Error adding PSO:", error);
      alert("Failed to add PSO");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = (pso, task) => {
    setSelectedPso(pso); // Store the selected PSO
    setPsoDetails({
      name: pso.name,
      description: pso.description,
      id: pso._id,
    });
    setModalTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalTask("");
  };

  const handlePSODelete = async (pso) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this PSO?"
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5001/api/psos/${pso._id}`
        );

        if (response.status === 200) {
          window.alert("PSO deleted successfully");
        } else {
          console.error("Failed to delete PSO:", response.data.error);
          window.alert("Failed to delete PSO");
        }
      } catch (error) {
        console.error("Error deleting PSO:", error);
        window.alert("Failed to delete PSO");
      }
    }
  };

  useEffect(() => {
    // Fetch PSOs
    const fetchPsos = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/psos");
        setPsos(response.data);
      } catch (error) {
        console.error("Error fetching PSOs:", error);
      }
    };
    fetchPsos();
  }, []);

  return (
    <Container maxWidth="md">
      {/* <Box mt={4}>
        <h2>Add PSO</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="PSO Name(Id)"
            value={psoDetails.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={psoDetails.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </form>
      </Box> */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Program Specific Outcomes</h3>
        <button style={buttonStyle} onClick={() => handleModalOpen({}, "Add")}>
          Add PSO
        </button>
      </div>

      <Box mt={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PSO Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {psos.map((pso) => (
                <TableRow key={pso.id}>
                  <TableCell>{pso.name}</TableCell>
                  <TableCell>{pso.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleModalOpen(pso, "Edit")}>
                      Edit
                    </Button>
                    <Button
                      onClick={() => handlePSODelete(pso)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "10px",
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <h2>{`${modalTask} PSO`}</h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <TextField
              label="PSO Name(Id)"
              value={psoDetails.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={psoDetails.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained">
              {modalTask}
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default AddPSO;
