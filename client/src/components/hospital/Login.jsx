import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios.js';



const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    try {
      console.log("Entering try block");
      
      // DEMO AXIOS: Sends email and password to the Express login endpoint
      const response = await api.post('/login', formData);

      const {token, hospital} = response.data;
      setMessage(response.data.message);

      //save the token to the localStorage:
      localStorage.setItem('token', token);

      console.log("Login Successful:", response.data);
      console.log("Login token:", response.data.token);
      console.log("local storage:", localStorage.getItem('token'));
      
      navigate(response.data.loc);

    } catch (error) {
      console.error("Login Failed:", error.response || error);
      setMessage(error.response?.data?.error || 'Login failed. Check credentials.');
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f8f8;
          font-family: Arial, sans-serif;
          padding: 20px;
          box-sizing: border-box;
        }
        .login-card {
          background-color: #ffffff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 350px;
          box-sizing: border-box;
          text-align: center;
        }
        .login-header {
          color: #D32F2F; 
          margin-bottom: 30px;
          margin-top: 0;
          font-weight: bold;
          font-size: 1.5rem;
        }
        .login-input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-sizing: border-box;
          font-size: 14px;
        }
        .login-button {
          width: 100%;
          padding: 12px;
          background-color: #D32F2F; 
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
          font-weight: bold;
          transition: background-color 0.3s;
          font-size: 16px;
        }
        .login-button:hover {
          background-color: #b71c1c;
        }
        .login-link {
          margin-top: 15px;
          display: block;
          color: #4CAF50;
          text-decoration: none;
          font-size: 14px;
        }
        .login-link:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 480px) {
          .login-card {
            padding: 24px 16px;
          }
          .login-header {
            font-size: 1.3rem;
            margin-bottom: 20px;
          }
          .login-input {
            padding: 10px;
            font-size: 13px;
          }
          .login-button {
            padding: 10px;
            font-size: 15px;
            margin-top: 15px;
          }
        }
      `}</style>
      <div className="login-card">
        <h2 className="login-header">🩸 DonorConnect Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            className="login-input" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            className="login-input" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <p style={{ marginTop: '15px', color: message.includes('Success') ? '#4CAF50' : '#D32F2F', fontSize: '14px' }}>
            {message}
        </p>
        <a href="/signup" className="login-link">
          Don't have an account? Sign Up
        </a>
      </div>
    </div>
  );
};

export default LoginPage;