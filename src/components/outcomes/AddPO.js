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

const AddPO = () => {
  const [poDetails, setPoDetails] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pos, setPos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPo, setSelectedPo] = useState(null);
  const [modalTask, setModalTask] = useState("");

  const handleChange = (field, value) => {
    setPoDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (modalTask === "Add") {
        await axios.post("http://localhost:5001/api/pos", poDetails);
        alert("PO added successfully");
      } else {
        await axios.put(
          `http://localhost:5001/api/pos/${poDetails.id}`,
          poDetails
        );
        alert("PO edited successfully");
      }
      setPoDetails({
        name: "",
        description: "",
      });
      setIsModalOpen(false);
      setModalTask("");
      const response = await axios.get("http://localhost:5001/api/pos");
      setPos(response.data);
    } catch (error) {
      console.error("Error adding PO:", error);
      alert("Failed to add PO");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = (po, task) => {
    setSelectedPo(po); // Store the selected PO
    setPoDetails({
      name: po.name,
      description: po.description,
      id: po._id,
    });
    setModalTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalTask("");
  };

  const handlePODelete = async (po) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this PO?"
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5001/api/pos/${po._id}`
        );
        if (response.status === 200) {
          window.alert("PO deleted successfully");
          const response = await axios.get("http://localhost:5001/api/pos");
          setPos(response.data);
        } else {
          console.error("Failed to delete PO:", response.data.error);
          window.alert("Failed to delete PO");
        }
      } catch (error) {
        console.error("Error deleting PO:", error);
        window.alert("Failed to delete PO");
      }
    }
  };

  useEffect(() => {
    const fetchPos = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/pos");
        setPos(response.data);
      } catch (error) {
        console.error("Error fetching POs:", error);
      }
    };
    fetchPos();
  }, []);

  return (
    <Container maxWidth="md">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Program Outcomes</h3>
        <button style={buttonStyle} onClick={() => handleModalOpen({}, "Add")}>
          Add PO
        </button>
      </div>

      <Box mt={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PO Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pos.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>{po.name}</TableCell>
                  <TableCell>{po.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleModalOpen(po, "Edit")}>
                      Edit
                    </Button>
                    <Button
                      onClick={() => handlePODelete(po)}
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
          <h2>{`${modalTask} PO`}</h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <TextField
              label="PO Name"
              value={poDetails.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={poDetails.description}
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

export default AddPO;
