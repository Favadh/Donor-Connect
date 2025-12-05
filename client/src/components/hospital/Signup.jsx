import { useState } from 'react';
import api from '../../utils/axios.js';
import { useNavigate } from 'react-router-dom';

const styles = {
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

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Creating account...');
    

    if (formData.password !== formData.confirmPassword) {
      return setMessage('Passwords do not match!');
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await api.post('/signup', userData);

      // On successful registration:
      console.log('token:', response.data.token);
      localStorage.setItem('token', response.data.token);
      setMessage(response.data.message);

      navigate('/formdata');
      
    } catch (error) {
      console.error("Signup Failed:", error.response || error);
      setMessage(error.response?.data?.error || 'Registration failed. Email may already be in use.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Join DonorConnect</h2>
        <form onSubmit={handleSubmit}>
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
        <a href="/" style={styles.link}>
          Already have an account? Log In
        </a>
      </div>
    </div>
  );
};

export default SignupPage;