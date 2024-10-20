import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    skills: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/userProfile', {
          withCredentials: true,  // Send cookies with the request
        });
        setUserData(response.data); // Set the fetched user data
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data);
      }
    };

    fetchUserData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle save
  const handleSave = () => {
    setIsEditing(false);
    // Optionally save the updated data to the server here
    console.log('Saved data:', userData);
  };

  return (
    <div className="profile-page">
      {/* Profile Header Section */}
      <div className="profile-header">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
          alt={userData.firstName}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{userData.firstName} {userData.lastName}</h2>
          <h4>Software Engineer</h4>
          <p>{userData.email}</p>
        </div>
        {!isEditing && <button className="edit-button" onClick={handleEdit}>Edit</button>}
      </div>

      {/* Personal Information Section */}
      <div className="personal-info-section">
        <h3>Personal Information</h3>
        <div className="personal-info">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div className="personal-info">
          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>
      </div>

      {/* Skills Section */}
      <div className="skills-section">
        <label>Skills</label>
        <input
          type="text"
          name="skills"
          value={userData.skills}
          onChange={handleChange}
          readOnly={!isEditing}
        />
      </div>

      {isEditing && (
        <div className="save-section">
          <button className="save-button" onClick={handleSave}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
