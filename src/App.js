import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddUser from "./components/users/AddUser";
import UsersView from "./components/users/UsersView";
import Users from "./components/users";
import EditUser from "./components/users/EditUser";
import Subjects from "./components/subjects";
import AddSubject from "./components/subjects/AddSubject";
import EditSubject from "./components/subjects/EditSubject";
import Outcomes from "./components/outcomes";
import AddPSO from "./components/outcomes/AddPSO";
import OutcomesView from "./components/outcomes/OutcomesView";
import AddPO from "./components/outcomes/AddPO";
import Components from "./components/components";
import AddCTDetails from "./components/components/AddCTDetails";
import AddAssignmentMarks from "./components/components/AddAssignmentMarks";
import AddCTMarks from "./components/components/AddCTMarks";
import Report from './components/reports';
import SubjectFinalReport from './components/reports/FinalReport';

import "./App.css";

const Layout = ({ children }) => {
  return (
    <div style={{ margin: "0 auto", padding: "50px 0" }}>
      {children}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Layout>
        <Routes>
          <Route path='/final-report' element={<Report />} />
          <Route path='/final-subject-report/:subjectId' element={<SubjectFinalReport />} />
          <Route path="/add-ct-details" element={<AddCTDetails />} />
          <Route path="/add-assignment-marks" element={<AddAssignmentMarks />} />
          <Route path="/add-ct-marks" element={<AddCTMarks />} />
          <Route path="/components" element={<Components />} />
          <Route path="/view-outcomes" element={<OutcomesView />} />
          <Route path="/add-pso" element={<AddPSO />} />
          <Route path="/add-po" element={<AddPO />} />
          <Route path="/outcomes" element={<Outcomes />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/edit-subject" element={<EditSubject />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/user" element={<UsersView />} />
          <Route path="/edit-user" element={<EditUser />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
