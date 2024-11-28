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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
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
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./utils/AuthContext";
import ServicesList from "./components/User/ServicesList";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Unauthorized from "./components/Common/Unauthorized";
import AdminContacts from "./pages/AdminContacts";
import ServiceDetails from "./components/User/ServiceDetails";
import BookServiceForm from "./components/User/BookServiceForm";
import AboutPage from "./pages/AboutPage";
import PaymentPage from "./pages/PaymentPage";

function SplitAppLayout() {
  const location = useLocation(); // Now it's within Router context

  const stripePromise = loadStripe("your-publishable-key-here");

  // Define routes where the Header and Sidebar should be hidden
  const noHeaderRoutes = ["/register", "/login", "/unauthorized"];
  const noSidebarRoutes = [
    "/",
    "/about",
    "/register",
    "/login",
    "/unauthorized",
  ]; // Same routes where you don't want the Sidebar

  return (
    <div className="layout">
      {/* Conditionally render the header only if the current route is not in the noHeaderRoutes */}
      {!noHeaderRoutes.includes(location.pathname) && <Header />}

      {/* Conditionally render the sidebar only if the current route is not in the noSidebarRoutes */}
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
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />

            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* Protected Routes */}
            <Route
              path="/Payment"
              element={
                <ProtectedRoute requiredRole="User">
                  <Elements stripe={stripePromise}>
                    <PaymentPage />
                  </Elements>
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
                <ProtectedRoute requiredRole="Service Provider">
                  <CreateService />
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
                // <ProtectedRoute>
                <ServicesList />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/service-list/:serviceId"
              element={
                <ProtectedRoute>
                  <ServiceDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/contact-us" element={<Contact />} />
            <Route
              path="/book-service/:serviceId"
              element={
                <ProtectedRoute>
                  <BookServiceForm />
                </ProtectedRoute>
              }
            />
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
            <Route path="*" element={<Navigate to="/unauthorized" />} />
          </Routes>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <SplitAppLayout />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
