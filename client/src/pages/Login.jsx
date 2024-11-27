import React, { useState } from "react";
import { FaEnvelope, FaLock, FaArrowRight, FaUser } from "react-icons/fa";
import { loginUser } from "../api/auth";
import Cookies from "js-cookie";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      console.log("Login successful", response);
  
      if (response.user && response.token) {
        // Store the user details and token
        const cookieData = { user: response.user };
        Cookies.set("auth", JSON.stringify(cookieData), { expires: 7 });
        localStorage.setItem("token", response.token);
  
        // Update AuthContext state with login function
        login(response.user, response.token);
        const { firstName, lastName, phone, address, bio, skills } = response.user;
        const isProfileComplete = firstName && lastName && phone && address && bio && skills && skills.length > 0;  
           
        // Redirect based on profile completeness
        if (isProfileComplete) {
          navigate("/");
        } else {
          navigate("/profile"); 
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data.msg) {
        setError(error.response.data.msg);
      } else {
        setError("Login failed. Please try again.");
      }
    } 
  };  

  const handleNavigate = () => {
    navigate("/register");
  };

  return (
    <div className="login-page-containerAK">
      <div className="login-heading-containerAK">
        <h1 className="appointme-titleAK">AppointME</h1>
        <p className="appointme-descriptionAK">
          AppointMe helps you connect and book an appointment <br /> with
          professional people.
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-buttonAK">
            Login <FaArrowRight className="arrow-iconAK" />
          </button>
          <button onClick={handleNavigate} className="register-buttonAK">
            Register <FaUser className="arrow-iconAK" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
