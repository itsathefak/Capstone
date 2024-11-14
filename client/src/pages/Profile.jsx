import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from "../../../client/src/utils/AuthContext";

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
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({}); // To store validation errors
  const { updateUser } = useAuth();

  // Fetch user data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/userProfile', {
          withCredentials: true,
        });
        setUserData(response.data);
        if (!response.data.phone || !response.data.address || !response.data.skills || !response.data.bio) {
          setIsOnboarding(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data);
        setErrorMessage('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  // Validation for each step
  const validateStep = () => {
    const errors = {};
    if (onboardingStep === 2) {
      if (!userData.phone) errors.phone = "Phone is required";
      if (!userData.address) errors.address = "Address is required";
    } else if (onboardingStep === 3) {
      if (!userData.skills) errors.skills = "Please enter at least one skill";
    } else if (onboardingStep === 4) {
      if (!userData.bio || userData.bio.length < 5) errors.bio = "Bio must be at least 5 characters";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear the error for this field
  };

  const handleNext = () => {
    if (validateStep()) {
      setOnboardingStep((prev) => prev + 1);
    }
  };

    // Handle edit mode
    const handleEdit = () => {
      setIsEditing(true);
      setSuccessMessage('');
      setErrorMessage('');
    };

  // After a successful API call to update user data
  const handleSave = async () => {
    if (validateStep()) {
      setIsEditing(false);
      setIsOnboarding(false);
      try {
        const response = await axios.put('http://localhost:5000/user/updateProfile', userData, {
          withCredentials: true,
        });
        setUserData(response.data);
        updateUser(response.data);
        setSuccessMessage('Profile updated successfully!');
      } catch (error) {
        console.error("Error updating user data:", error.response?.data);
        setErrorMessage('Failed to update profile');
      }
    }
  };

  // Modal content for each step
  const renderOnboardingStep = () => {
    switch (onboardingStep) {
      case 0:
        return <p>Welcome to the App! Click Next to start setting up your profile.</p>;
      case 1:
        return <p>Let’s fill in some details to get started. Click Next to continue.</p>;
      case 2:
        return (
          <>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              required
            />
            {validationErrors.phone && <span className="profile-error-text">{validationErrors.phone}</span>}
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              required
            />
            {validationErrors.address && <span className="profile-error-text">{validationErrors.address}</span>}
          </>
        );
      case 3:
        return (
          <>
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={userData.skills}
              onChange={handleChange}
              placeholder="E.g., JavaScript, React"
            />
            {validationErrors.skills && <span className="profile-error-text">{validationErrors.skills}</span>}
          </>
        );
      case 4:
        return (
          <>
            <label>Bio (minimum 5 characters)</label>
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              minLength="5"
              placeholder="Tell us about yourself..."
              required
            />
            {validationErrors.bio && <span className="profile-error-text">{validationErrors.bio}</span>}
          </>
        );
      default:
        return null;
    }
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
        {!isEditing && (
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>

      {/* Success or Error Messages */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

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
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      )}

      {/* Onboarding Modal */}
      <Modal
        isOpen={isOnboarding}
        onRequestClose={setIsOnboarding}
        shouldCloseOnOverlayClick={false}
        className="profile-onboarding-modal"
      >
        {renderOnboardingStep()}
        <div className="profile-modal-navigation">
          {onboardingStep < 4 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleSave}>Save Profile</button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
