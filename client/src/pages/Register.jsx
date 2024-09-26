import React from 'react';
import { FaEnvelope, FaUser, FaLock , FaArrowRight } from 'react-icons/fa';

const Register = () => {
  return (
    <div className="login-page-containerAK">
      <div className="login-heading-containerAK">
        <h1 className="appointme-titleAK">AppointME</h1>
        <p className="appointme-descriptionAK">
          AppointMe helps you connect and book an appointment
          <br />
          with the professional people.
        </p>
      </div>

      <div className="login-form-containerAK">
        <form className="login-formAK">
          <div className="input-containerAK">
            <FaEnvelope className="input-iconAK" />
            <input type="email" className="login-inputAK" placeholder="Email" required />
          </div>
          <div className="input-containerAK">
            <FaUser className="input-iconAK" />
            <input type="text" className="login-inputAK" placeholder="Username" required />
          </div>
          <div className="input-containerAK">
  <FaUser className="input-iconAK" />
  <select className="login-selectAK">
    <option value="" disabled selected>Select User Type</option>
    <option value="provider">Service Provider</option>
    <option value="user">Regular User</option>
  </select>
</div>

          <div className="input-containerAK">
            <FaLock className="input-iconAK" />
            <input type="password" className="login-inputAK" placeholder="Password" required />
          </div>
          <div className="input-containerAK">
            <FaLock className="input-iconAK" />
            <input type="password" className="login-inputAK" placeholder="Confirm Password" required />
          </div>
          <button type="submit" className="login-buttonAK">
            Register
            <FaArrowRight className="arrow-iconAK" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
