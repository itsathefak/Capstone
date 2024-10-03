import "./App.css";
import "./index.css";
import CreateService from "./components/ServiceProvider/CreateServiceForm";
import AppointmentRequests from "./components/ServiceProvider/AppointmentRequests";
import UpcomingAppointments from "./components/ServiceProvider/UpcomingAppointments";
import Footer from "./components/Common/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditService from "./components/ServiceProvider/EditServiceForm";

function App() {
  return (
    <div className="App">
      <EditService />
      <CreateService />
      <Register />

      <AppointmentRequests />
      <UpcomingAppointments />
      <Login />

      <Footer />
    </div>
  );
}

export default App;
