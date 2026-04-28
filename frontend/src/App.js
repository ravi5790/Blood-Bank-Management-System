import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import DonorDashboard from "./pages/DonorDashboard";
import ReceiverDashboard from "./pages/ReceiverDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Toaster richColors position="top-right" />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/dashboard/donor" element={
              <ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/receiver" element={
              <ProtectedRoute role="receiver"><ReceiverDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/hospital" element={
              <ProtectedRoute role="hospital"><HospitalDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
          </Routes>
          <Analytics />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
