import React, { useState, useEffect } from 'react';
import api from '../../utils/axios.js';
import { useNavigate } from 'react-router-dom';

// Dummy data to simulate fetched donors
const dummyDonors = [
  {
    id: 1,
    fullName: 'John Doe',
    bloodType: 'O+',
    age: 28,
    city: 'New York',
    phoneNo: '123-456-7890',
    imageUrl: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    bloodType: 'A-',
    age: 34,
    city: 'Los Angeles',
    phoneNo: '234-567-8901',
    imageUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    fullName: 'Sam Wilson',
    bloodType: 'B+',
    age: 25,
    city: 'Chicago',
    phoneNo: '345-678-9012',
    imageUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 4,
    fullName: 'Emily Clark',
    bloodType: 'AB+',
    age: 31,
    city: 'Houston',
    phoneNo: '456-789-0123',
    imageUrl: 'https://i.pravatar.cc/150?img=32',
  },
  // Add more donors to see wrapping
    {
    id: 5,
    fullName: 'Michael Brown',
    bloodType: 'O-',
    age: 42,
    city: 'Phoenix',
    phoneNo: '567-890-1234',
    imageUrl: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: 6,
    fullName: 'Sarah Davis',
    bloodType: 'A+',
    age: 29,
    city: 'Philadelphia',
    phoneNo: '678-901-2345',
    imageUrl: 'https://i.pravatar.cc/150?img=47',
  },
];

const Dashboard = () => {
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [donors, setDonors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await api.get('/viewDonors');
        console.log(response.data);
        
        setDonors(response.data.donors);
      } catch (err) {
        setError('Failed to fetch game accounts');
        console.error(err);
      }
    };
    fetchDonors();
  }, []);

  const handleAppoint = async (donorId) => {
    try {
      const response = await api.get(`/appointDonor/${donorId}`);
      alert(response.data.msg);
    } catch (error) {
      console.error("Error appointing donor:", error);
      alert("Failed to appoint donor. Please try again.");
    }
  };

  const handleLogout = () => {
    // Placeholder for logout logic
    console.log('User logging out...');
    localStorage.removeItem('token');
    navigate('/');
    alert('Logged out successfully!');
  };

  const logoutButtonStyle = {
    ...styles.logoutButton,
    ...(isLogoutHovered ? { backgroundColor: 'white', color: '#d9232d' } : {})
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Donor Connect</h1>
        <button 
          style={logoutButtonStyle}
          onClick={handleLogout}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
        >
          Logout
        </button>
      </header>

      <main style={styles.cardSection}>
        {(Array.isArray(donors) ? donors : donors.data || []).map((donor) => (
          <div key={donor.id || donor._id} style={styles.card}>
            <div style={styles.profilePicContainer}>
              <img src={donor.imageUrl} alt={donor.fullName} style={styles.profilePic} />
            </div>
            <div style={styles.cardContent}>
              <h2 style={styles.donorName}>{donor.fullName}</h2>
              <p style={styles.donorDetail}><strong>Blood Type:</strong> {donor.bloodType}</p>
              <p style={styles.donorDetail}><strong>Age:</strong> {donor.age}</p>
              <p style={styles.donorDetail}><strong>City:</strong> {donor.city}</p>
              <p style={styles.donorDetail}><strong>Phone:</strong> {donor.phoneNo}</p>
            </div>
            <button
              style={styles.appointButton}
              onClick={() => handleAppoint(donor._id)}
            >
              Appoint
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

// Basic CSS-in-JS for styling
const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    color: '#333',
  },
  header: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    boxSizing: 'border-box',
  },
  headerTitle: {
    color: '#d9232d',
    margin: 0,
    fontSize: '1.8rem',
  },
  logoutButton: {
    backgroundColor: '#d9232d',
    color: 'white',
    border: '1px solid #d9232d',
    padding: '0.6rem 1.2rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, color 0.3s',
  },
  cardSection: {
    padding: '2rem',
    paddingTop: '130px', // Offset for fixed header
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Responsive grid
    gap: '1.5rem',
    maxWidth: '1200px', // Constrain the max width
    margin: '0 auto', // Center the section
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    padding: '1rem', // Reduced padding
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s',
  },
  profilePicContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto 1rem',
    border: '4px solid #d9232d',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardContent: {
    flexGrow: 1,
  },
  donorName: {
    margin: '0.5rem 0',
    color: '#d9232d',
  },
  donorDetail: {
    margin: '0.4rem 0',
    fontSize: '0.95rem',
    color: '#555',
  },
  appointButton: {
    backgroundColor: '#d9232d',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1.5rem', // Reduced padding
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '0.8rem', // Reduced margin
    width: '100%',
    transition: 'background-color 0.3s',
  },
};

export default Dashboard;