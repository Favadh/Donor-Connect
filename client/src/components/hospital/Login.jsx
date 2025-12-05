import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios.js';

const styles = {
  // ... (Keep the existing styles object)
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f8f8',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    width: '350px',
    textAlign: 'center',
  },
  header: {
    color: '#D32F2F', 
    marginBottom: '30px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#D32F2F', 
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  link: {
    marginTop: '15px',
    display: 'block',
    color: '#4CAF50',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>🩸 DonorConnect Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            style={styles.input} 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            style={styles.input} 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <button type="submit" style={styles.button}>
            Log In
          </button>
        </form>
        <p style={{ marginTop: '15px', color: message.includes('Success') ? '#4CAF50' : '#D32F2F', fontSize: '14px' }}>
            {message}
        </p>
        <a href="/signup" style={styles.link}>
          Don't have an account? Sign Up
        </a>
      </div>
    </div>
  );
};

export default LoginPage;