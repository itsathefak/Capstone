// import logo from './logo.svg';
import "./App.css";
import "./index.css";
import CreateService from "./components/ServiceProvider/CreateServiceForm";
import AppointmentRequests from "./components/ServiceProvider/AppointmentRequests";
import UpcomingAppointments from "./components/ServiceProvider/UpcomingAppointments";

function App() {
  return (
    <div className="App">
      {/* <CreateService /> */}
      <AppointmentRequests/>
      {/* <UpcomingAppointments /> */}
    </div>
  );
}

export default App;
