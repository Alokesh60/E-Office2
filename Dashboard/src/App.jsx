import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import About from "./pages/About";
import HelpAndSupport from "./pages/HelpAndSupport";
import Files from "./pages/Files";
import Application from "./pages/Applications"; // Student
import AdminApplication from "./pages/AdminApplication";
import FacultyApplication from "./pages/FacultyApplication";
import Submissions from "./pages/Submissions";
import FormFill from "./pages/FormFill";
import StudentSubmissions from "./pages/StudentSubmissions";
import { Toaster } from "react-hot-toast";

export default function App() {
  const role = "admin"; // change to "student" | "faculty" | "admin" dynamically later

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Pass role to Dashboard so it can render faculty vs student view */}
          <Route index element={<Dashboard role={role} />} />

          <Route path="account" element={<Account role={role} />}>
            <Route path="security" element={<Security />} />
            <Route path="about" element={<About />} />
            <Route path="help" element={<HelpAndSupport />} />
          </Route>

          {/* ROLE-BASED APPLICATION PAGE */}
          <Route
            path="applications"
            element={
              role === "admin" ? (
                <AdminApplication />
              ) : role === "faculty" ? (
                <Submissions />
              ) : (
                <Application />
              )
            }
          />

          {/* DETAIL PAGE */}
          <Route
            path="applications/:id"
            element={role === "faculty" ? <FacultyApplication /> : <FormFill />}
          />

          <Route path="student-submissions" element={<StudentSubmissions />} />
          <Route path="files" element={<Files />} />
          <Route path="settings" element={<Settings role={role} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
