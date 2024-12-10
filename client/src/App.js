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
import Sidebar from "./components/Common/SideBar";
import Profile from "./pages/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./utils/AuthContext";
import ServicesList from "./components/User/ServicesList";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Unauthorized from "./components/Common/Unauthorized";
import AdminContacts from "./pages/AdminContacts";
import ServiceDetails from "./components/User/ServiceDetails";
import AboutPage from "./pages/AboutPage";
import PaymentWrapper from "./utils/PaymentWrapper"; // Updated to import from utils
import MyServices from "./components/ServiceProvider/MyServices";

const HomeLayout = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

function SplitAppLayout() {
  const location = useLocation();

  // Define routes where the Header and Sidebar should be hidden
  const noHeaderRoutes = ["/register", "/login", "/unauthorized"];
  const noSidebarRoutes = ["/about", "/register", "/login", "/unauthorized"];

  return (
    <div className="layout">
      {/* Conditionally render the header */}
      {!noHeaderRoutes.includes(location.pathname) && <Header />}

      <div className="main-container">
        {!noSidebarRoutes.includes(location.pathname) && <Sidebar />}

        <div
          className={`content ${
            noSidebarRoutes.includes(location.pathname) ? "no-sidebar" : ""
          }`}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
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
                <ProtectedRoute requiredRole="Service Provider">
                  <CreateService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-service"
              element={
                <ProtectedRoute requiredRole="Service Provider">
                  <MyServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-service/:serviceId"
              element={
                <ProtectedRoute requiredRole="Service Provider">
                  <EditService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/:serviceId"
              element={
                <ProtectedRoute requiredRole="User">
                  <ServiceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-service/:serviceId"
              element={
                <ProtectedRoute requiredRole="User">
                  <BookingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment-requests"
              element={
                <ProtectedRoute requiredRole="Service Provider">
                  <AppointmentRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upcoming-appointments"
              element={
                <ProtectedRoute requiredRole="Service Provider">
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
            <Route path="/contact-us" element={<Contact />} />
            <Route
              path="/appointment-history"
              element={
                <ProtectedRoute requiredRole="User">
                  <AppointmentHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-contact"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminContacts />
                </ProtectedRoute>
              }
            />
            {/* Redirect to login for any unmatched routes */}
            <Route
              path="*"
              element={<Navigate to="/unauthorized" state={{ is404: true }} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomeLayout />} />
            <Route path="/*" element={<SplitAppLayout />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
