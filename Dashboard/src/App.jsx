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
import Application from "./pages/Applications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="account" element={<Account />}>
            <Route path="security" element={<Security />} />
            <Route path="about" element={<About />} />
            {/* Change this path to "help" to match the Account.jsx NavLink */}
            <Route path="help" element={<HelpAndSupport />} />
          </Route>
          <Route path="applications" element={<Application />} />
          <Route path="files" element={<Files />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
