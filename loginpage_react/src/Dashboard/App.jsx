import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import About from "./pages/About";
import HelpAndSupport from "./pages/HelpAndSupport";
import Files from "./pages/Files";
import ApplicationSubmitted from "./pages/ApplicationSubmitted";
import AdminApplication from "./pages/AdminApplication";
import FacultyApplication from "./pages/FacultyApplication";
import Submissions from "./pages/Submissions";
import FormFill from "./pages/FormFill";
import StudentSubmissions from "./pages/StudentSubmissions";
import { Toaster } from "react-hot-toast";

export default function App() {
  const role = "admin";

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard role={role} />} />

          <Route path="account" element={<Account role={role} />}>
            <Route path="security" element={<Security />} />
            <Route path="about" element={<About />} />
            <Route path="help" element={<HelpAndSupport />} />
          </Route>

          <Route
            path="applications"
            element={
              role === "admin" ? (
                <AdminApplication />
              ) : role === "faculty" ? (
                <Submissions />
              ) : (
                <ApplicationSubmitted />
              )
            }
          />

          <Route
            path="applications/:id"
            element={
              role === "faculty"
                ? <FacultyApplication />
                : <FormFill />
            }
          />

          <Route
            path="student-submissions"
            element={<StudentSubmissions />}
          />
          <Route path="files" element={<Files />} />
          <Route path="settings" element={<Settings role={role} />} />
        </Route>
      </Routes>
    </>
  );
}