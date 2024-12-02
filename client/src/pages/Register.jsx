import React, { useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaLock,
  FaArrowRight,
  FaWrench,
} from "react-icons/fa";
import { registerUser } from "../api/auth";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>Register | AppointMe</title>
        <meta name="description" content="Start your journey by signing up as a user or service provider to access our appointment booking application." />
        <meta name="keywords" content="register, create account, new user" />
      </Helmet>

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
            <label htmlFor="email" className="input-labelAK">
              Email
            </label>
            <FaEnvelope className="input-iconAK" />
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="login-inputAK"
              required
            />
          </div>
          <div className="input-containerAK">
            <label htmlFor="firstName" className="input-labelAK">
              First Name
            </label>
            <FaUser className="input-iconAK" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="login-inputAK"
              required
            />
          </div>
          <div className="input-containerAK">
            <label htmlFor="lastName" className="input-labelAK">
              Last Name
            </label>
            <FaUser className="input-iconAK" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="login-inputAK"
              required
            />
          </div>
          <div className="input-containerAK">
            <label htmlFor="role" className="input-labelAK">
              User Type
            </label>
            <FaWrench className="input-iconAK" />
            <select
              id="role"
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
            <label htmlFor="password" className="input-labelAK">
              Password
            </label>
            <FaLock className="input-iconAK" />
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="login-inputAK"
              required
            />
          </div>
          <div className="input-containerAK">
            <label htmlFor="confirmPassword" className="input-labelAK">
              Confirm Password
            </label>
            <FaLock className="input-iconAK" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
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
}  

export default Register;
