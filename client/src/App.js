import "./App.css";
import "./index.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CreateService from "./components/ServiceProvider/CreateServiceForm";
import AppointmentRequests from "./components/ServiceProvider/AppointmentRequests";
import UpcomingAppointments from "./components/ServiceProvider/UpcomingAppointments";
import AppointmentHistory from "./components/User/AppointmentHistory";
import Footer from "./components/Common/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditService from "./components/ServiceProvider/EditServiceForm";
import Header from "./components/Common/Header";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./utils/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-service"
              element={
                <ProtectedRoute>
                  <CreateService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-service/:serviceId"
              element={
                <ProtectedRoute>
                  <EditService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment-requests"
              element={
                <ProtectedRoute>
                  <AppointmentRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upcoming-appointments"
              element={
                <ProtectedRoute>
                  <UpcomingAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments-history"
              element={
                <ProtectedRoute>
                  <AppointmentHistory />
                </ProtectedRoute>
              }
            />

            {/* Redirect to login for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
