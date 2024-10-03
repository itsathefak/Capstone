import React, { useState } from 'react';

const Profile = () => {
  // Initial user data
  const [userData, setUserData] = useState({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@gmail.com',
    phone: '(213) 432-1234',
    address: 'Suite 47, 308 King st N, Waterloo, ON',
    bio: "My name is Jane Doe, I'm a Certified Software Engineer",
    skills: '',
  });

  // State to manage whether the fields are editable or not
  const [isEditing, setIsEditing] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle click on Edit button
  const handleEdit = () => {
    setIsEditing(true);  // Enable editing
  };

  // Handle click on Save button
  const handleSave = () => {
    setIsEditing(false);  // Disable editing after saving
    // Perform save operation here, like sending the updated data to the server
    console.log('Saved data:', userData);
  };

  return (
    <div className="profile-page">
      {/* Profile Header Section */}
      <div className="profile-header">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
          alt="Jane Doe"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>Jane Doe</h2>
          <h4>Software Engineer</h4>
          <p>{userData.email}</p>
        </div>
        {!isEditing && <button className="edit-button" onClick={handleEdit}>Edit</button>} {/* Show Edit button only if not editing */}
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
              readOnly={!isEditing}  // Make input read-only if not editing
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              readOnly={!isEditing}  // Make input read-only if not editing
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
              readOnly={!isEditing}  // Make input read-only if not editing
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              readOnly={!isEditing}  // Make input read-only if not editing
            />
          </div>
        </div>
        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            readOnly={!isEditing}  // Make input read-only if not editing
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
          placeholder="Add Skills Separated by ,"
          readOnly={!isEditing}  // Make input read-only if not editing
        />
      </div>

      {/* Save Changes Button */}
      {isEditing && (
        <div className="save-section">
          <button className="save-button" onClick={handleSave}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
