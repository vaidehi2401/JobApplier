import React, { useState, useRef, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import API_BASE_URL from "../config";
import Header from './Header'
const Profile = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showCareerForm, setShowCareerForm] = useState(false);

  const [profileInfo, setProfileInfo] = useState({
    address: '',
    primary: '',
    secondary: '',
    graduation: ''
  });
  const [careerGoals, setCareerGoals] = useState({
    jobType: '',
    experience: '',
    github: '',
    linkedin: ''
  });
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const response = await axios.get(`${API_BASE_URL}/api/users/userDetails`, {
          headers: {
            'Authorization': token,
          }
        });
  
        const data = response.data;
  
        setProfileInfo({
          address: data.address || '',
          primary: data.primaryEducation || '',
          secondary: data.secondaryEducation || '',
          graduation: data.graduationDetails || ''
        });
  
        setCareerGoals({
          jobType: data.jobType || '',
          experience: data.experienceLevel || '',
          github: data.githubUrl || '',
          linkedin: data.linkedinUrl || ''
        });
  
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, []);
  
  const profileRef = useRef(null);
  const careerRef = useRef(null);

  // Close popup when clicking outside the form
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showProfileForm && profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileForm(false);
      }
      if (showCareerForm && careerRef.current && !careerRef.current.contains(e.target)) {
        setShowCareerForm(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showProfileForm, showCareerForm]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.post(`${API_BASE_URL}/api/users/personalInfo`, profileInfo, {
        headers: {
          'Authorization': token,
        }
      });
      console.log('Profile info saved:', response.data);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Error saving profile info:', error);
    }
  };

  const handleCareerSubmit = async(e) => {
    e.preventDefault();
    try{
      const token = localStorage.getItem("token");
      if (!token) return;  
      const response = await axios.post(`${API_BASE_URL}/api/users/careerInfo`, careerGoals, {
        headers: {
          'Authorization': token,
        }
      })
    setShowCareerForm(false);
    }
    catch(error){
      console.error('Error saving career goals:', error);
    }
  };

  return (
    <div className="profile-container">
    
<Header/>
      <div className="main-content">
        <header className="profile-header">
          <button className="btn" onClick={() => setShowProfileForm(true)}>Update Profile Info</button>
          <button className="btn" onClick={() => setShowCareerForm(true)}>Update Career Goals</button>
        </header>

        <div className="info-section">
          <div className="info-box">
            <h3>Profile Information</h3>
            <p><strong>Address:</strong> {profileInfo.address}</p>
            <p><strong>Primary Education:</strong> {profileInfo.primary}</p>
            <p><strong>Secondary Education:</strong> {profileInfo.secondary}</p>
            <p><strong>Graduation:</strong> {profileInfo.graduation}</p>
          </div>
          <div className="info-box">
            <h3>Career Goals</h3>
            <p><strong>Job Type:</strong> {careerGoals.jobType}</p>
            <p><strong>Experience:</strong> {careerGoals.experience}</p>
            <p><strong>GitHub:</strong> {
              careerGoals.github ? <a href={careerGoals.github} target="_blank" rel="noreferrer">{careerGoals.github}</a> : ''
            }</p>
            <p><strong>LinkedIn:</strong> {
              careerGoals.linkedin ? <a href={careerGoals.linkedin} target="_blank" rel="noreferrer">{careerGoals.linkedin}</a> : ''
            }</p>
          </div>
        </div>

        {showProfileForm && (
          <div className="modal">
            <form onSubmit={handleProfileSubmit} className="popup-form" ref={profileRef}>
              <h2>Update Profile Info</h2>
              {/* Profile Form */}
<input
  type="text"
  placeholder="Address"
  value={profileInfo.address}
  onChange={(e) => setProfileInfo({ ...profileInfo, address: e.target.value })}
/>
<input
  type="text"
  placeholder="Primary Education"
  value={profileInfo.primary}
  onChange={(e) => setProfileInfo({ ...profileInfo, primary: e.target.value })}
/>
<input
  type="text"
  placeholder="Secondary Education"
  value={profileInfo.secondary}
  onChange={(e) => setProfileInfo({ ...profileInfo, secondary: e.target.value })}
/>
<input
  type="text"
  placeholder="Graduation"
  value={profileInfo.graduation}
  onChange={(e) => setProfileInfo({ ...profileInfo, graduation: e.target.value })}
/>

              <button type="submit">Save</button>
            </form>
          </div>
        )}

        {showCareerForm && (
          <div className="modal">
            <form onSubmit={handleCareerSubmit} className="popup-form" ref={careerRef}>
            {/* Career Form */}
<select
  value={careerGoals.jobType}
  onChange={(e) => setCareerGoals({ ...careerGoals, jobType: e.target.value })}
>
  <option value="">Select Job Type</option>
  <option value="Developer">Developer</option>
  <option value="UI/UX Designer">UI/UX Designer</option>
  <option value="Tester">Tester</option>
</select>

<select
  value={careerGoals.experience}
  onChange={(e) => setCareerGoals({ ...careerGoals, experience: e.target.value })}
>
  <option value="">Select Experience Level</option>
  <option value="0-2 years">0-2 years</option>
  <option value="2-5 years">2-5 years</option>
  <option value=">5 years">&gt; 5 years</option>
</select>

<input
  type="text"
  placeholder="GitHub URL"
  value={careerGoals.github}
  onChange={(e) => setCareerGoals({ ...careerGoals, github: e.target.value })}
/>
<input
  type="text"
  placeholder="LinkedIn URL"
  value={careerGoals.linkedin}
  onChange={(e) => setCareerGoals({ ...careerGoals, linkedin: e.target.value })}
/>

              <button type="submit">Save</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
