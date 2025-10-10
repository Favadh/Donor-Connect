import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// Placeholder base URL for your Express backend
const API_BASE_URL = 'http://localhost:8000/api'; 

// Use the same styles object or import it if in a separate file
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
    marginBottom: '20px',
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
  select: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50', 
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
    color: '#D32F2F', 
    textDecoration: 'none',
    fontSize: '14px',
  },
};

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    Navigate('/dashboard');
    setMessage('Creating account...');

    if (formData.password !== formData.confirmPassword) {
      return setMessage('Passwords do not match!');
    }

    try {
      // Data to send to the backend for User creation
      const userData = {
        email: formData.email,
        password: formData.password,
        role: formData.role, // Critical field for your system
      };
      
      // DEMO AXIOS: Sends user data to the Express register endpoint
      const response = await axios.post(`${API_BASE_URL}/signup`, userData);

      // On successful registration:
      localStorage.setItem('token', response.data.token);
      setMessage(`Success! Account created. Please complete your ${formData.role} profile.`);

      // Redirect logic to the next step (profile creation)
      // Example: window.location.href = formData.role === 'hospital' ? '/hospital/setup' : '/donor/setup';

    } catch (error) {
      console.error("Signup Failed:", error.response || error);
      setMessage(error.response?.data?.error || 'Registration failed. Email may already be in use.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>✨ Join DonorConnect</h2>
        <form onSubmit={handleSubmit}>
          <select 
            name="role"
            value={formData.role} 
            onChange={handleChange} 
            style={styles.select}
          >
            <option value="donor">I am a Donor 🩸</option>
            <option value="hospital">I am a Hospital / Coordinator 🏥</option>
          </select>

          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            style={styles.input} 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password (Min 6 characters)" 
            style={styles.input} 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="confirmPassword"
            placeholder="Confirm Password" 
            style={styles.input} 
            value={formData.confirmPassword}
            onChange={handleChange}
            required 
          />
          
          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>
        <p style={{ marginTop: '15px', color: message.includes('Success') ? '#4CAF50' : '#D32F2F', fontSize: '14px' }}>
            {message}
        </p>
        <a href="/login" style={styles.link}>
          Already have an account? Log In
        </a>
      </div>
    </div>
  );
};

export default SignupPage;