import React, { useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaLock,
  FaArrowRight,
  FaWrench,
} from "react-icons/fa";
import { registerUser } from "../api/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const { firstName, lastName, email, role, password, confirmPassword } =
    formData;

  // Password strength validation function
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    return "";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Registration successful", response);
      localStorage.setItem("token", response.token);
      window.location = '/login';
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred during registration.");
      }
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="login-page-containerAK">
      <div className="login-heading-containerAK">
        <h1 className="appointme-titleAK">AppointME</h1>
        <p className="appointme-descriptionAK">
          AppointMe helps you connect and book an appointment
          <br />
          with professional people.
        </p>
      </div>

      <div className="login-form-containerAK">
        <form className="login-formAK" onSubmit={handleSubmit}>
          <div className="input-containerAK">
            <FaEnvelope className="input-iconAK" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              className="login-inputAK"
              required
            />
          </div>
          <div className="input-containerAK">
            <FaUser className="input-iconAK" />
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="login-inputAK"
              required
            />
          </div>
          <div className="input-containerAK">
            <FaUser className="input-iconAK" />
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="login-inputAK"
              required
            />
          </div>
          <div className="input-containerAK">
            <FaWrench className="input-iconAK" />
            <select
              name="role"
              value={role}
              onChange={handleChange}
              className="login-selectAK"
              required
            >
              <option value="" disabled hidden>
                Select User Type
              </option>
              <option value="Service Provider">Service Provider</option>
              <option value="User">Regular User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="input-containerAK">
            <FaLock className="input-iconAK" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              className="login-inputAK"
              required
            />
          </div>
          <div className="input-containerAK">
            <FaLock className="input-iconAK" />
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="login-inputAK"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

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
