import { useState } from 'react';
import api from '../../utils/axios.js';
import { useNavigate } from 'react-router-dom';

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
    <div className="signup-container">
      <style>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f8f8;
          font-family: Arial, sans-serif;
          padding: 20px;
          box-sizing: border-box;
        }
        .signup-card {
          background-color: #ffffff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 350px;
          box-sizing: border-box;
          text-align: center;
        }
        .signup-header {
          color: #D32F2F;
          margin-bottom: 20px;
          margin-top: 0;
          font-weight: bold;
          font-size: 1.5rem;
        }
        .signup-input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-sizing: border-box;
          font-size: 14px;
        }
        .signup-button {
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
        .signup-button:hover {
          background-color: #b71c1c;
        }
        .signup-link {
          margin-top: 15px;
          display: block;
          color: #4CAF50; 
          text-decoration: none;
          font-size: 14px;
        }
        .signup-link:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 480px) {
          .signup-card {
            padding: 24px 16px;
          }
          .signup-header {
            font-size: 1.3rem;
            margin-bottom: 15px;
          }
          .signup-input {
            padding: 10px;
            font-size: 13px;
          }
          .signup-button {
            padding: 10px;
            font-size: 15px;
            margin-top: 15px;
          }
        }
      `}</style>
      <div className="signup-card">
        <h2 className="signup-header">Join DonorConnect</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            className="signup-input" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password (Min 6 characters)" 
            className="signup-input" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="confirmPassword"
            placeholder="Confirm Password" 
            className="signup-input" 
            value={formData.confirmPassword}
            onChange={handleChange}
            required 
          />
          
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>
        <p style={{ marginTop: '15px', color: message.includes('Success') ? '#4CAF50' : '#D32F2F', fontSize: '14px' }}>
            {message}
        </p>
        <a href="/" className="signup-link">
          Already have an account? Log In
        </a>
      </div>
    </div>
  );
};

export default SignupPage;