// import logo from './logo.svg';
import "./App.css";
import "./index.css";
import CreateService from "./components/ServiceProvider/CreateServiceForm";
import AppointmentRequests from "./components/ServiceProvider/AppointmentRequests";
import UpcomingAppointments from "./components/ServiceProvider/UpcomingAppointments";
import Footer from "./components/Common/Footer";
import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      <AppointmentRequests />
      <UpcomingAppointments />
      <Login />
      <CreateService />
      <Footer />
    </div>
  );
}

export default App;
