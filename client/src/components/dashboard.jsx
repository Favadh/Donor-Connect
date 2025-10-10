import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Assume your base URL and token handling logic are defined elsewhere
const API_BASE_URL = 'http://localhost:5000/api/donors'; 

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f8f8f8', // Light background for the overall page
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    color: '#333',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  statusButton: (isAvailable) => ({
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    backgroundColor: isAvailable ? '#4CAF50' : '#D32F2F', // Green for Available, Red for Unavailable
    color: 'white',
    transition: 'background-color 0.3s',
    marginBottom: '20px',
    width: '100%',
  }),
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    color: '#333',
  },
  bloodType: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#D32F2F', // Deep Red for high visibility
    backgroundColor: '#FFEBEE', // Very light red background
    padding: '8px',
    borderRadius: '4px',
  },
  alert: {
    marginTop: '20px',
    padding: '10px',
    borderRadius: '8px',
    color: '#856404',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
  },
};

const DonorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data Logic ---
  useEffect(() => {
    const fetchProfile = async () => {
      // NOTE: In a real MERN app, the userId should come from the JWT token,
      // not a fixed string. For this demo, we'll use a placeholder.
      const userId = 'CURRENT_LOGGED_IN_USER_ID'; 
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to view the dashboard.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data.donor);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- Update Availability Logic ---
  const toggleAvailability = async () => {
    if (!profile) return;
    const newAvailability = !profile.isAvailable;
    const token = localStorage.getItem('token');
    
    try {
      // DEMO AXIOS: Sends PATCH request to update the status
      const response = await axios.patch(
        `${API_BASE_URL}/${profile.userId}`, // Use userId from profile for update route
        { isAvailable: newAvailability },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state with the new profile data
      setProfile(response.data.donor);
      alert(`Status updated to: ${newAvailability ? 'AVAILABLE' : 'UNAVAILABLE'}`);

    } catch (err) {
      console.error("Update Failed:", err.response || err);
      alert('Failed to update availability status.');
    }
  };

  if (loading) return <div style={styles.container}>Loading profile...</div>;
  if (error) return <div style={styles.container} styles={{ color: '#D32F2F' }}>Error: {error}</div>;
  if (!profile) return <div style={styles.container}>Profile not found. Please complete registration.</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome Back, {profile.fullName.split(' ')[0]}!</h1>
      
      <div style={styles.card}>
        <h3 style={{ borderBottom: '2px solid #D32F2F', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            Donor Profile Status
        </h3>
        
        {/* Availability Toggle Button */}
        <button 
          onClick={toggleAvailability}
          style={styles.statusButton(profile.isAvailable)}
        >
          {profile.isAvailable ? '✅ AVAILABLE FOR DONATION' : '🚫 CURRENTLY UNAVAILABLE'}
        </button>

        {/* Blood Type is Primary Data */}
        <div style={styles.dataRow}>
          <span style={styles.label}>Blood Type:</span>
          <span style={styles.bloodType}>{profile.bloodType}</span>
        </div>

        {/* Basic Contact/Location Data */}
        <div style={styles.dataRow}>
          <span style={styles.label}>Name:</span>
          <span style={styles.value}>{profile.fullName}</span>
        </div>
        <div style={styles.dataRow}>
          <span style={styles.label}>Phone:</span>
          <span style={styles.value}>{profile.phoneNumber}</span>
        </div>
        <div style={styles.dataRow}>
          <span style={styles.label}>Location:</span>
          <span style={styles.value}>{profile.locationCity}, {profile.locationState}</span>
        </div>
        <div style={{...styles.dataRow, borderBottom: 'none'}}>
          <span style={styles.label}>Registered Organ Donor:</span>
          <span style={styles.value}>{profile.organDonor ? 'Yes ❤️' : 'No'}</span>
        </div>

        {/* Immediate Screening Status */}
        <div style={styles.alert}>
            Your status reflects that you have **{profile.recentAntibiotics ? 'recently taken antibiotics' : 'passed immediate health checks'}**.
        </div>

      </div>
    </div>
  );
};

export default DonorDashboard;