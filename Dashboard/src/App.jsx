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
import FacultyApplication from "./pages/FacultyApplication"; // 🆕
import Submissions from "./pages/Submissions";

export default function App() {
  const role = "faculty"; // change dynamically later

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="account" element={<Account />}>
            <Route path="security" element={<Security />} />
            <Route path="about" element={<About />} />
            <Route path="help" element={<HelpAndSupport />} />
          </Route>

          {/* ✅ ROLE BASED APPLICATION PAGE */}
          {/* APPLICATION FLOW */}

<Route
  path="applications"
  element={
    role === "admin" ? (
      <AdminApplication /> // if admin has different UI
    ) : (
      <Submissions /> // student + faculty both see list
    )
  }
/>

{/* DETAIL PAGE */}
<Route
  path="applications/:id"
  element={
    role === "faculty" ? (
      <FacultyApplication />
    ) : (
      <Application /> // student view
    )
  }
/>

          <Route path="files" element={<Files />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
