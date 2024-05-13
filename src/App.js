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
import Report from "./components/reports";
import SubjectFinalReport from "./components/reports/FinalReport";
import Login from "./components/auth/Login";

import "./App.css";

const Layout = ({ children }) => {
  return <div style={{ margin: "0 auto", padding: "50px 0" }}>{children}</div>;
};

const App = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(!(localStorage.getItem("loggedInUsername") || null));

  useEffect(() => {
    setIsLoggedOut(!(localStorage.getItem('loggedInUsername') || null))
  }, [localStorage.getItem('loggedInUsername')])

  return (
    <Router>
      <Navbar />
      <Layout>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/final-report"
            element={isLoggedOut ? <Navigate to="/login" /> : <Report />}
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
            path="/add-pso"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddPSO />}
          />
          <Route
            path="/add-po"
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
            path="/add-subject"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddSubject />}
          />
          <Route
            path="/edit-subject"
            element={isLoggedOut ? <Navigate to="/login" /> : <EditSubject />}
          />
          <Route
            path="/users"
            element={isLoggedOut ? <Navigate to="/login" /> : <Users />}
          />
          <Route
            path="/add-user"
            element={isLoggedOut ? <Navigate to="/login" /> : <AddUser />}
          />
          <Route
            path="/user"
            element={isLoggedOut ? <Navigate to="/login" /> : <UsersView />}
          />
          <Route
            path="/edit-user"
            element={isLoggedOut ? <Navigate to="/login" /> : <EditUser />}
          />
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
