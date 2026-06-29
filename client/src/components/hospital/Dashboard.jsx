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

  const [donors, setDonors] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await api.get('/viewDonors');
        console.log(response.data);
        
        setDonors(response.data.donors);
      } catch (err) {
        setError('Failed to fetch donors');
        console.error(err);
      }
    };
    fetchDonors();
  }, []);

  // Get unique values for filters
  const bloodTypes = [...new Set((donors || []).map(donor => donor.bloodType))];
  const cities = [...new Set((donors || []).map(donor => donor.city))];

  // Filter donors based on selected blood type and city
  const filteredDonors = (donors || []).filter(donor => {
    const bloodTypeMatch = selectedBloodType ? donor.bloodType === selectedBloodType : true;
    const cityMatch = selectedCity ? donor.city === selectedCity : true;
    return bloodTypeMatch && cityMatch;
  });

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
    console.log('User logging out...');
    localStorage.removeItem('token');
    navigate('/');
    alert('Logged out successfully!');
  };



  return (
    <div className="dashboard-page">
      <style>{`
        .dashboard-page {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          min-height: 100vh;
          color: #333;
        }
        .dashboard-header {
          background-color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          box-sizing: border-box;
        }
        .dashboard-header-title {
          color: #d9232d;
          margin: 0;
          font-size: 1.8rem;
        }
        .dashboard-logout-btn {
          background-color: #d9232d;
          color: white;
          border: 1px solid #d9232d;
          padding: 0.6rem 1.2rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: background-color 0.3s, color 0.3s;
        }
        .dashboard-logout-btn:hover {
          background-color: white;
          color: #d9232d;
        }
        .dashboard-main-content {
          padding-top: 80px;
        }
        .dashboard-filter-container {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 1.5rem 2rem;
          background-color: #fff;
          border-bottom: 1px solid #eee;
          box-sizing: border-box;
        }
        .dashboard-filter-select {
          padding: 0.6rem 1rem;
          border-radius: 5px;
          border: 1px solid #e0e0e0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          background-color: white;
          font-size: 1rem;
          min-width: 220px;
          box-sizing: border-box;
        }
        .dashboard-card-section {
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .dashboard-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          text-align: center;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s;
          box-sizing: border-box;
        }
        .dashboard-card:hover {
          transform: translateY(-4px);
        }
        .dashboard-profile-pic-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 1rem;
          border: 4px solid #d9232d;
        }
        .dashboard-profile-pic {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dashboard-card-content {
          flex-grow: 1;
        }
        .dashboard-donor-name {
          margin: 0.5rem 0;
          color: #d9232d;
          font-size: 1.25rem;
        }
        .dashboard-donor-detail {
          margin: 0.4rem 0;
          font-size: 0.95rem;
          color: #555;
        }
        .dashboard-appoint-btn {
          background-color: #d9232d;
          color: white;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          margin-top: 0.8rem;
          width: 100%;
          transition: background-color 0.3s;
          box-sizing: border-box;
        }
        .dashboard-appoint-btn:hover {
          background-color: #b71c1c;
        }

        /* Responsiveness breakpoints */
        @media (max-width: 768px) {
          .dashboard-header {
            padding: 1rem 1.5rem;
          }
          .dashboard-header-title {
            font-size: 1.5rem;
          }
          .dashboard-logout-btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
          .dashboard-card-section {
            padding: 1.5rem;
            gap: 1.25rem;
          }
        }

        @media (max-width: 600px) {
          .dashboard-header {
            padding: 0.75rem 1rem;
          }
          .dashboard-header-title {
            font-size: 1.3rem;
          }
          .dashboard-logout-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
          }
          .dashboard-filter-container {
            flex-direction: column;
            gap: 0.75rem;
            padding: 1rem;
          }
          .dashboard-filter-select {
            min-width: 100%;
            width: 100%;
          }
          .dashboard-card-section {
            padding: 1rem;
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="dashboard-header">
        <h1 className="dashboard-header-title">Donor Connect</h1>
        <button 
          className="dashboard-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-main-content">
        <div className="dashboard-filter-container">
          <select
            className="dashboard-filter-select"
            value={selectedBloodType}
            onChange={(e) => setSelectedBloodType(e.target.value)}
          >
            <option value="">Filter by Blood Type</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="dashboard-filter-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Filter by City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="dashboard-card-section">
          {filteredDonors.map((donor) => (
            <div key={donor.id || donor._id} className="dashboard-card">
              <div className="dashboard-profile-pic-container">
                <img src="https://cdn-icons-png.freepik.com/512/8861/8861091.png" alt={donor.fullName} className="dashboard-profile-pic" />
              </div>
              <div className="dashboard-card-content">
                <h2 className="dashboard-donor-name">{donor.fullName}</h2>
                <p className="dashboard-donor-detail"><strong>Blood Type:</strong> {donor.bloodType}</p>
                <p className="dashboard-donor-detail"><strong>Age:</strong> {donor.age}</p>
                <p className="dashboard-donor-detail"><strong>City:</strong> {donor.city}</p>
                <p className="dashboard-donor-detail"><strong>Phone:</strong> {donor.phoneNo}</p>
              </div>
              <button
                className="dashboard-appoint-btn"
                onClick={() => handleAppoint(donor._id)}
              >
                Appoint
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// Basic CSS-in-JS for styling


export default Dashboard;