import "./App.css";
import "./index.css";
import CreateService from "./components/ServiceProvider/CreateServiceForm";
import AppointmentRequests from "./components/ServiceProvider/AppointmentRequests";
import UpcomingAppointments from "./components/ServiceProvider/UpcomingAppointments";
import Footer from "./components/Common/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditService from "./components/ServiceProvider/EditServiceForm";
import Header from "./components/Common/Header";
// import Sidebar from "./components/Common/Sidebar";
import Profile from "./pages/Profile";
import AppointmentHistory from "./components/User/AppointmentHistory";
// import { BrowserRouter as Router, Route, Routes, Switch,useLocation } from 'react-router-dom';

// // Function to conditionally render Sidebar
// const Layout = ({ children }) => {
//   const location = useLocation();

//   // Hide sidebar on login or register page
//   const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

//   return (
//     <>
//       <Header />
//       {!isAuthPage && <Sidebar />} 
//       <main className="content">
//         {children}
//       </main>
//       <Footer />
//     </>
//   );
// };

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/create-service" element={<CreateService />} />
//           <Route path="/appointments" element={<AppointmentRequests />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/" element={<UpcomingAppointments />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }


function App() {
  return (
    <div className="App">
      <Header />
      <EditService />
      <CreateService />
      <Register />

      <AppointmentRequests />
      <UpcomingAppointments />
      <AppointmentHistory />
      <Profile />
      <Login />

      <Register />
      <Footer />

    </div>
  );
}

export default App;
