import "./App.css";
import "./index.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import CreateService from "./components/ServiceProvider/CreateServiceForm";
import AppointmentRequests from "./components/ServiceProvider/AppointmentRequests";
import UpcomingAppointments from "./components/ServiceProvider/UpcomingAppointments";
import AppointmentHistory from "./components/User/AppointmentHistory";
import Footer from "./components/Common/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditService from "./components/ServiceProvider/EditServiceForm";
import BookingForm from "./components/User/BookServiceForm";
import Header from "./components/Common/Header";
import Sidebar from "./components/Common/SideBar"; // Make sure the import for Sidebar is correct
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./utils/AuthContext";
import ServicesList from "./components/User/ServicesList";
import ServiceDetail from "./components/User/ServiceDetails";

function LayoutWithHeaderAndSidebar() {
  const location = useLocation(); // Now it's within Router context

  // Define routes where the Header and Sidebar should be hidden
  const noHeaderRoutes = ["/abc"];
  const noSidebarRoutes = ["/", "/register"]; // Same routes where you don't want the Sidebar

  return (
    <>
      {/* Conditionally render the header only if the current route is not in the noHeaderRoutes */}
      {!noHeaderRoutes.includes(location.pathname) && <Header />}

      {/* Conditionally render the sidebar only if the current route is not in the noSidebarRoutes */}
      {/* {!noSidebarRoutes.includes(location.pathname) && <Sidebar />} */}

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
          path="/service-list"
          element={
            <ProtectedRoute>
              <ServicesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment-history"
          element={
            <ProtectedRoute>
              <AppointmentHistory />
            </ProtectedRoute>
          }
        />

        {/* Redirect to login for any unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <LayoutWithHeaderAndSidebar />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
