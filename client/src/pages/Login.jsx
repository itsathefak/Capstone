import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { loginUser } from '../api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData); 
      console.log('Login successful', response);
      localStorage.setItem('token', response.token); 
      window.location = '/dashboard'; 
    } catch (error) {
      if (error.msg) {
        setError(error.msg); 
      } else {
        setError('Login failed. Please try again.'); 
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-page-containerAK">
      <div className="login-heading-containerAK">
        <h1 className="appointme-titleAK">AppointME</h1>
        <p className="appointme-descriptionAK">
          AppointMe helps you connect and book an appointment <br /> with professional people.
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
        </form>
      </div>
    </div>
  );
};

export default Login;
