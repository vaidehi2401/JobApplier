import React from 'react';
import '../css/Header.css';
import { FaUser, FaChartPie, FaBell, FaSuitcase, FaSignOutAlt,  FaUserTie  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className='profile-container'>
      <aside className="sidebar">
        <div className="icon" onClick={() => navigate('/profile')}>
          <FaUser /> Profile
        </div>
        <div className="icon" onClick={() => navigate('/dashboard')}>
          <FaChartPie /> Dashboard
        </div>
        <div className="icon" onClick={() => navigate('/companies')}>
          <FaSuitcase /> Companies
        </div>
        <div className="icon" onClick={() => navigate('/applications')}>
          <FaUserTie/> Job Applications
        </div>

        {/* Logout button at bottom */}
        <div className="logout-section">
          <div className="icon" onClick={() => navigate('/login')}>
            <FaSignOutAlt /> Logout
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Header;
