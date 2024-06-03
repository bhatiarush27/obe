// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001;

const cors = require("cors");

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/obe", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// USER SECTION-------------------------------------------------------------------------------------------------------
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  level: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);

// ROUTES FOR USERS
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User({ ...req.body });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, username, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, username, email });
    res.status(204).send();
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting User:", error);
    res.status(500).json({ error: "Failed to delete User" });
  }
});

// SUBJECTS SECTION---------------------------------------------------------------------------------------------------------
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  session: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  cos: [
    {
      coCode: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
    },
  ],
  assignedFaculty: {
    type: String,
    required: true,
  },
  coPoMapping: {
    type: [
      [
        {
          label: String,
          value: Number,
        },
      ],
    ],
    validate: {
      validator: function (arr) {
        return (
          Array.isArray(arr) && arr.every((innerArr) => Array.isArray(innerArr))
        );
      },
      message: "Invalid CO-PO Mapping format",
    },
    required: true,
  },
  coPsoMapping: {
    type: [
      [
        {
          label: String,
          value: Number,
        },
      ],
    ],
    validate: {
      validator: function (arr) {
        return (
          Array.isArray(arr) && arr.every((innerArr) => Array.isArray(innerArr))
        );
      },
      message: "Invalid CO-PSO Mapping format",
    },
    required: true,
  },
});

const Subject = mongoose.model("subjects", subjectSchema);

//ROUTES FOR SUBJECTS
app.post("/api/subjects", async (req, res) => {
  try {
    const newSubject = new Subject({
      ...req.body,
    });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ error: "Failed to add subject" });
  }
});

app.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

app.get("/api/v2/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find({
      session: req.query.session,
      semester: req.query.semester,
    });
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

app.get("/api/v2/subject", async (req, res) => {
  try {
    const subject = await Subject.findOne({
      session: req.query.session,
      _id: req.query.subjectId,
    });
    res.json(subject);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

app.get("/api/subjects/:subjectId", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    res.json(subject);
  } catch (error) {
    console.error("Error fetching Subject:", error);
    res.status(500).json({ error: "Failed to fetch Subject" });
  }
});

app.put("/api/subjects/:id", async (req, res) => {
  try {
    await Subject.findByIdAndUpdate(req.params.id, req.body);
    res.status(204).send();
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ error: "Failed to update subject" });
  }
});

// POs Section-------------------------------------------------------------------------------------------------------
const poSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const PO = mongoose.model("pos", poSchema);

// Routes for POs
app.post("/api/pos", async (req, res) => {
  try {
    const newPO = new PO({ ...req.body });
    await newPO.save();
    res.status(201).json(newPO);
  } catch (error) {
    console.error("Error adding PO:", error);
    res.status(500).json({ error: "Failed to add PO" });
  }
});

app.get("/api/pos", async (req, res) => {
  try {
    const pos = await PO.find();
    res.json(pos);
  } catch (error) {
    console.error("Error fetching POs:", error);
    res.status(500).json({ error: "Failed to fetch POs" });
  }
});

app.get("/api/pos/:id", async (req, res) => {
  try {
    const po = await PO.findById(req.params.id);
    res.json(po);
  } catch (error) {
    console.error("Error fetching PO:", error);
    res.status(500).json({ error: "Failed to fetch PO" });
  }
});

app.put("/api/pos/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    await PO.findByIdAndUpdate(req.params.id, { name, description });
    res.status(204).send();
  } catch (error) {
    console.error("Error updating PO:", error);
    res.status(500).json({ error: "Failed to update PO" });
  }
});

app.delete("/api/pos/:id", async (req, res) => {
  try {
    const po = await PO.findByIdAndDelete(req.params.id);
    if (!po) {
      return res.status(404).json({ error: "PO not found" });
    }
    res.json({ message: "PO deleted successfully" });
  } catch (error) {
    console.error("Error deleting PO:", error);
    res.status(500).json({ error: "Failed to delete PO" });
  }
});

// PSOs Section-------------------------------------------------------------------------------------------------------
const psoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const PSO = mongoose.model("psos", psoSchema);

// Routes for PSOs
app.post("/api/psos", async (req, res) => {
  try {
    const newPSO = new PSO({ ...req.body });
    await newPSO.save();
    res.status(201).json(newPSO);
  } catch (error) {
    console.error("Error adding PSO:", error);
    res.status(500).json({ error: "Failed to add PSO" });
  }
});

app.get("/api/psos", async (req, res) => {
  try {
    const psos = await PSO.find();
    res.json(psos);
  } catch (error) {
    console.error("Error fetching PSOs:", error);
    res.status(500).json({ error: "Failed to fetch PSOs" });
  }
});

app.get("/api/psos/:id", async (req, res) => {
  try {
    const pso = await PSO.findById(req.params.id);
    res.json(pso);
  } catch (error) {
    console.error("Error fetching PSO:", error);
    res.status(500).json({ error: "Failed to fetch PSO" });
  }
});

app.delete("/api/psos/:id", async (req, res) => {
  try {
    const pso = await PSO.findByIdAndDelete(req.params.id);
    if (!pso) {
      return res.status(404).json({ error: "PSO not found" });
    }
    res.json({ message: "PSO deleted successfully" });
  } catch (error) {
    console.error("Error deleting PSO:", error);
    res.status(500).json({ error: "Failed to delete PSO" });
  }
});

app.put("/api/psos/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    await PSO.findByIdAndUpdate(req.params.id, { name, description });
    res.status(204).send();
  } catch (error) {
    console.error("Error updating PSO:", error);
    res.status(500).json({ error: "Failed to update PSO" });
  }
});

//COMPONENTS Section-------------------------------------------------------------------------------------------------------------
const componentSchema = new mongoose.Schema({
  componentId: {
    type: String,
    unique: true,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Total marks must be greater than 0",
    },
  },
  questions: [
    {
      questionNumber: {
        type: String,
        required: true,
      },
      maxMarks: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value > 0;
          },
          message: "Total marks must be greater than 0",
        },
      },
      co: {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            return value !== "";
          },
          message: "CO should be selected!",
        },
      },
      level: {
        type: String,
        required: true,
        validate: {
          validator: function (value) {
            return value !== "";
          },
          message: "Level should be selected!",
        },
      },
    },
  ],
  fields: {
    type: [String],
    required: true,
  },
  componentName: {
    type: String,
    required: true,
  },
  subjectId: {
    type: String,
    required: true,
  },
});

const Component = mongoose.model("components", componentSchema);

//ROUTES FOR SUBJECTS
app.post("/api/components", async (req, res) => {
  try {
    const { componentId, session, semester } = req.body;

    const existingComponent = await Component.findOne({
      componentId,
      session,
      semester,
    });

    if (existingComponent) {
      const updatedComponent = { ...req.body, semester, session };
      delete updatedComponent._id;
      const result = await Component.findOneAndUpdate(
        { componentId, session: req.body.session, semester: req.body.semester },
        updatedComponent,
        { new: true }
      );
      res.status(200).json(result);
    } else {
      // If the component doesn't exist, create a new one
      const newComponent = new Component({ ...req.body });
      await newComponent.save();
      res.status(201).json(newComponent);
    }
  } catch (error) {
    console.error("Error adding/updating component:", error);
    res.status(500).json({ error: "Failed to add/update component" });
  }
});

app.get("/api/components/component/:componentId", async (req, res) => {
  try {
    const component = await Component.findOne({
      componentId: req.params.componentId,
    });
    res.json(component);
  } catch (error) {
    console.error("Error fetching Component:", error);
    res.status(500).json({ error: "Failed to fetch Component" });
  }
});

app.get(`/api/v2/components/:subjectId`, async (req, res) => {
  try {
    console.log("id", req.params.subjectId);
    const components = await Component.find({
      subjectId: req.params.subjectId,
      semester: req.query.semester,
      session: req.query.session,
    });
    res.json(components);
  } catch (error) {
    console.error("Error fetching Components:", error);
    res.status(500).json({ error: "Failed to fetch Components" });
  }
});

app.get("/api/components/subject-wise/:subjectId", async (req, res) => {
  try {
    console.log("id", req.params.subjectId);
    const components = await Component.find({
      subjectId: req.params.subjectId,
    });
    res.json(components);
  } catch (error) {
    console.error("Error fetching Components:", error);
    res.status(500).json({ error: "Failed to fetch Components" });
  }
});

//Results schema-------------------------------------------------------------------------------------------------------------
const resultSchema = new mongoose.Schema({
  componentId: {
    type: String,
    required: true,
  },
  subjectId: {
    type: String,
    required: true,
  },
  componentName: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  results: {
    type: [
      {
        enrollmentNumber: {
          type: String,
          required: true,
        },
        totalMarks: {
          type: Number,
          required: true,
        },
        marks: [
          {
            question: {
              type: String,
              required: true,
            },
            maxMarks: {
              type: Number,
              required: true,
            },
            attempted: {
              type: Boolean,
              required: true,
            },
            obtainedMarks: {
              type: Number,
              required: true,
              validate: {
                validator: function (value) {
                  return value >= 0;
                },
                message: "Marks cannot be negative!",
              },
            },
          },
        ],
      },
    ],
  },
});

const Result = mongoose.model("results", resultSchema);

app.get("/api/results/:componentId", async (req, res) => {
  try {
    const component = await Result.findOne({
      componentId: req.params.componentId,
    });
    res.json(component);
  } catch (error) {
    console.error("Error fetching Component result:", error);
  }
});

app.get("/api/v2/results/:componentId", async (req, res) => {
  try {
    const component = await Result.findOne({
      componentId: req.params.componentId,
      semester: req.query.semester,
      session: req.query.session,
    });
    res.json(component);
  } catch (error) {
    console.error("Error fetching Component result:", error);
  }
});

app.post("/api/v2/results", async (req, res) => {
  try {
    const newResult = new Result({ ...req.body });
    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error("Error adding result:", error);
    res.status(500).json({ error: "Failed to add result" });
  }
});

app.put("/api/v2/results", async (req, res) => {
  try {
    const { componentId, session } = req.body;
    await Result.findByIdAndUpdate({componentId, session}, {...req.body});
    res.status(204).send();
  } catch (error) {
    console.error("Error updating Result:", error);
    res.status(500).json({ error: "Failed to update Result" });
  }
});

//Assignment------------------------------------------------------------------------------------------------------------------
const assignmentSchema = new mongoose.Schema({
  componentId: {
    type: String,
    required: true,
  },
  subjectId: {
    type: String,
    required: true,
  },
  componentName: {
    type: String,
    required: true,
  },
  results: {
    type: [
      {
        enrollmentNumber: {
          type: String,
          required: true,
        },
        atMarks: {
          type: Number,
          required: true,
        },
        taqMarks: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

const Assignment = mongoose.model("assignments", assignmentSchema);

app.get("/api/assignments/:componentId", async (req, res) => {
  try {
    const component = await Assignment.findOne({
      componentId: req.params.componentId,
    });
    res.json(component);
  } catch (error) {
    console.error("Error fetching Assignment:", error);
  }
});

app.post("/api/assignments", async (req, res) => {
  try {
    const newAssignment = new Assignment({ ...req.body });
    await newAssignment.save();
    res.status(201).json({ success: true, newAssignment });
  } catch (error) {
    console.error("Error creating Assignment:", error);
    res.status(500).json({ error: "Failed to create Assignment" });
  }
});

app.put("/api/assignments/update", async (req, res) => {
  try {
    const { componentId, ...assignmentData } = req.body;
    const existingAssignment = await Assignment.findOne({ componentId });
    existingAssignment.set(assignmentData);
    await existingAssignment.save();
    res.status(200).json({ success: true, updatedResult: existingAssignment });
  } catch (error) {
    console.error("Error updating Assignment:", error);
    res.status(500).json({ error: "Failed to update Assignment" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
