import React from 'react';
import { FaEnvelope, FaUser, FaLock, FaArrowRight } from 'react-icons/fa'; // Importing icons

const Login = () => {
  return (
    <div className="login-page-containerAK">
      <div className="login-heading-containerAK">
        <h1 className="appointme-titleAK">AppointME</h1>
        <p className="appointme-descriptionAK">
          AppointMe helps you connect and book an appointment <br /> with professional people.
        </p>
      </div>
      <div className="login-form-containerAK">
        <form className="login-formAK">
          <div className="input-containerAK">
            <FaEnvelope className="input-iconAK" />
            <input type="email" placeholder="Email" className="login-inputAK" required />
          </div>
          <div className="input-containerAK">
            <FaUser className="input-iconAK" />
            <input type="text" placeholder="Username" className="login-inputAK" required />
          </div>
          <div className="input-containerAK">
            <FaLock className="input-iconAK" />
            <input type="password" placeholder="Password" className="login-inputAK" required />
          </div>
          <button type="submit" className="login-buttonAK">
            Login <FaArrowRight className="arrow-iconAK" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
