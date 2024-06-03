import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import AddExitSurveyMarks from "./components/components/AddExitSurveyMarks";
import SubjectReportForm from "./components/reports/FinalReportSubjectForm";
import Reports from "./components/reports";
import SubjectFinalReport from "./components/reports/FinalReport";
import SemesterReportForm from "./components/reports/FinalReportSemesterForm";
import Login from "./components/auth/Login";
import SemesterFinalReport from "./components/reports/SemesterFinalReport";
import Home from "./components/Home";
import SubjectsList from "./components/subjects/SubjectsList";

import permissions from "./utils/permissions";

import "./App.css";

const Layout = ({ children }) => {
  return <div style={{ margin: "0 auto", padding: "50px 0" }}>{children}</div>;
};

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState({
    name: localStorage.getItem("loggedInUsername") || null,
    level: localStorage.getItem("loggedInUserLevel") || null,
  });
  const isLoggedOut = !loggedInUser.level;

  console.log("isLog", isLoggedOut, loggedInUser.level);

  const userPermissions = permissions[loggedInUser.level] || [];

  useEffect(() => {
    setLoggedInUser({
      name: localStorage.getItem("loggedInUsername") || null,
      level: localStorage.getItem("loggedInUserLevel") || null,
    });
  }, [localStorage.getItem("loggedInUsername")]);

  return (
    <Router>
      <Navbar permissions={userPermissions} />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={isLoggedOut ? <Navigate to="/login" /> : <Home />}
          />
          <Route
            path="/final-report"
            element={
              isLoggedOut ? <Navigate to="/login" /> : <SubjectReportForm />
            }
          />
          <Route
            path="/final-report-semester"
            element={
              isLoggedOut ? <Navigate to="/login" /> : <SemesterReportForm />
            }
          />
          <Route
            path="/final-report-semester/report"
            element={
              isLoggedOut ? <Navigate to="/login" /> : <SemesterFinalReport />
            }
          />
          <Route
            path="/reports"
            element={isLoggedOut ? <Navigate to="/login" /> : <Reports />}
          />
          <Route
            path="/final-subject-report/:subjectId"
            element={
              isLoggedOut ? <Navigate to="/login" /> : <SubjectFinalReport />
            }
          />
          <Route
            path="/add-ct-details"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddCTDetails />}
          />
          <Route
            path="/add-assignment-marks"
            element={
              isLoggedOut ? <Navigate to="/login" /> : <AddAssignmentMarks />
            }
          />
          <Route
            path="/add-ct-marks"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddCTMarks />}
          />
          <Route
            path="/add-survey-marks"
            element={
              isLoggedOut ? <Navigate to="/login" /> : <AddExitSurveyMarks />
            }
          />
          <Route
            path="/components"
            element={isLoggedOut ? <Navigate to="/login" /> : <Components />}
          />
          <Route
            path="/view-outcomes"
            element={isLoggedOut ? <Navigate to="/login" /> : <OutcomesView />}
          />
          <Route
            path="/program-specific-outcomes"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddPSO />}
          />
          <Route
            path="/program-outcomes"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddPO />}
          />
          <Route
            path="/outcomes"
            element={isLoggedOut ? <Navigate to="/login" /> : <Outcomes />}
          />
          <Route
            path="/subjects"
            element={isLoggedOut ? <Navigate to="/login" /> : <Subjects />}
          />
          <Route
            path="/subject-list"
            element={isLoggedOut ? <Navigate to="/login" /> : <SubjectsList permissions={userPermissions} />}
          />
          <Route
            path="/add-subject"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddSubject />}
          />
          <Route
            path="/edit-subject"
            element={isLoggedOut ? <Navigate to="/login" /> : <EditSubject />}
          />
          <Route
            path="/users"
            element={
              isLoggedOut ? (
                <Navigate to="/login" />
              ) :
                <UsersView permissions={userPermissions} />
            }
          />
          {/* <Route
            path="/add-user"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddUser />}
          /> */}
          {/* <Route
            path="/user"
            element={isLoggedOut ? <Navigate to="/login" /> : <UsersView />}
          /> */}
          {/* <Route
            path="/edit-user"
            element={isLoggedOut ? <Navigate to="/login" /> : <EditUser />}
          /> */}
        </Routes>
      </Layout>
      {/* <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              loggedInUsername ? (
                <Routes>
                  <Route path="/final-report" element={<Report />} />
                  <Route
                    path="/final-subject-report/:subjectId"
                    element={<SubjectFinalReport />}
                  />
                  <Route path="/add-ct-details" element={<AddCTDetails />} />
                  <Route
                    path="/add-assignment-marks"
                    element={<AddAssignmentMarks />}
                  />
                  <Route path="/add-ct-marks" element={<AddCTMarks />} />
                  <Route
                    path="/add-survey-marks"
                    element={<AddExitSurveyMarks />}
                  />
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
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Layout> */}
    </Router>
  );
};

export default App;
