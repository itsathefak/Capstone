import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from "../../../client/src/utils/AuthContext";
import { Helmet } from "react-helmet";

const Profile = () => {
  const [userData, setUserData] = useState({
    userImage: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    skills: '',
    experience: '',
    occupation: '',
    linkedIn: '',
    education: '',
    industry: '',
    languages: '',
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
    } else if (onboardingStep === 5) {
      if (!userData.experience) errors.experience = "Experience is required";
      if (!userData.occupation) errors.occupation = "Occupation is required";
    } else if (onboardingStep === 6) {
      if (!userData.linkedIn) errors.linkedIn = "LinkedIn profile is required";
      if (!userData.education) errors.education = "Please select your highest education level";
    } else if (onboardingStep === 7) {
      if (!userData.industry) errors.industry = "Please select an industry";
      if (!userData.languages) errors.languages = "Please specify at least one language";
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
    window.location.reload();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result; // Base64-encoded string
      uploadToServer(base64String); // Send Base64 to the server
    };

    reader.readAsDataURL(file); // Read the file as Base64
  };

const uploadToServer = async (base64Image) => {
  try {
    const response = await axios.put(
      "http://localhost:5000/user/uploadProfilePicture",
      { userImage: base64Image },
      { withCredentials: true }
    );
    await fetchUserData(); // Re-fetch user data
    alert("Profile picture updated successfully!");
  } catch (error) {
    console.error("Error uploading image:", error.response?.data);
    alert("Failed to upload image.");
  }
};



  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/userProfile", {
        withCredentials: true,
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


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
            <label htmlFor='mPhone'>Phone</label>
            <input
              id="mPhone"
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              required
            />
            {validationErrors.phone && <span className="profile-error-text">{validationErrors.phone}</span>}
            <label htmlFor="mAddress">Address</label>
            <input
              id="mAddress"
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
            <label htmlFor="mSkills">Skills (comma-separated)</label>
            <input
              id="mSkills"
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
            <label htmlFor="mBio">Bio (minimum 5 characters)</label>
            <textarea
              id="mBio"
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
      case 5:
        return (
          <>
            <label htmlFor="mExperience">Experience</label>
            <select
              id="mExperience"
              name="experience"
              value={userData.experience}
              onChange={handleChange}
              className="profile-dropdown"
            >
              <option value="">Select Experience</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
            {validationErrors.experience && <span className="profile-error-text">{validationErrors.experience}</span>}

            <label htmlFor="mOccupation">Occupation</label>
            <input
              type="text"
              id="mOccupation"
              name="occupation"
              value={userData.occupation}
              onChange={handleChange}
              placeholder="E.g., Software Engineer"
            />
            {validationErrors.occupation && <span className="profile-error-text">{validationErrors.occupation}</span>}
          </>
        );
      case 6:
        return (
          <>

            <label htmlFor="mLinkedIn">LinkedIn Profile</label>
            <input
              type="url"
              id="mLinkedIn"
              name="linkedIn"
              value={userData.linkedIn}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/your-profile"
              required
            />
            {validationErrors.linkedIn && <span className="profile-error-text">{validationErrors.linkedIn}</span>}

            <label htmlFor="mEducation">Highest Education Level</label>
            <select
              id="mEducation"
              name="education"
              value={userData.education}
              onChange={handleChange}
              className="profile-dropdown"
              required
            >
              <option value="">Select Education</option>
              <option value="High School">High School</option>
              <option value="Associate's Degree">Associate's Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
            </select>
            {validationErrors.education && <span className="profile-error-text">{validationErrors.education}</span>}


          </>
        );
      case 7:
        return (
          <>

            <label htmlFor="mIndustry">Industry</label>
            <select
              id="mIndustry"
              name="industry"
              value={userData.industry}
              onChange={handleChange}
              className="profile-dropdown"
              required
            >
              <option value="">Select Industry</option>
              <option value="IT">IT</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Other">Other</option>
            </select>
            {validationErrors.industry && <span className="profile-error-text">{validationErrors.industry}</span>}

            <label htmlFor="mLanguages">Languages Spoken</label>
            <input
              type="text"
              id="mLanguages"
              name="languages"
              value={userData.languages}
              onChange={handleChange}
              placeholder="E.g., English, French, Spanish"
              required
            />
            {validationErrors.languages && <span className="profile-error-text">{validationErrors.languages}</span>}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <Helmet>
        <title>Profile | AppointMe</title>
        <meta name="description" content="Visit my profile page to view and manage my account details like contact details, skills, occupation, and profile image." />
        <meta name="keywords" content="profile, account, contact details, bio" />
      </Helmet>

      {/* Profile Header Section */}
      <div className="profile-header">
        <img
          src={userData.userImage || "https://via.placeholder.com/150"}
          alt="Profile Avatar"
          className="profile-avatar"
        />
        {isEditing && (
          <div className="profile-upload-section">
          <label htmlFor="profileImage" className="profile-upload-button">
            Upload Image
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }} // Hide the file input
          />
        </div>
        )}
        <div className="profile-info">
          <h2>{userData.firstName} {userData.lastName}</h2>
          <h3>Software Engineer</h3>
          <h4>{userData.occupation}</h4>
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
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
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
            <label htmlFor="experience">Experience</label>
            <select
              id="experience"
              name="experience"
              value={userData.experience}
              onChange={handleChange}
              className="profile-dropdown"
              disabled={!isEditing}
            >
              <option value="">Select Experience</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>

          </div>
          <div>
            <label htmlFor="occupation">Occupation</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={userData.occupation}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div className="personal-info">
          <div>
            <label htmlFor="linkedIn">LinkedIn Profile</label>
            <input
              type="url"
              id="linkedIn"
              name="linkedIn"
              value={userData.linkedIn}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/your-profile"
              readOnly={!isEditing}
            />
          </div>

          <div>
            <label htmlFor="education">Highest Education Level</label>
            <select
              id="education"
              name="education"
              value={userData.education}
              onChange={handleChange}
              className="profile-dropdown"
              disabled={!isEditing}
            >
              <option value="">Select Education</option>
              <option value="High School">High School</option>
              <option value="Associate's Degree">Associate's Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </div>
        </div>
        <div className="personal-info">
          <div>
            <label htmlFor="industry">Industry</label>
            <select
              id="industry"
              name="industry"
              value={userData.industry}
              onChange={handleChange}
              className="profile-dropdown"
              disabled={!isEditing}
            >
              <option value="">Select Industry</option>
              <option value="IT">IT</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="languages">Languages Spoken</label>
            <input
              type="text"
              id="languages"
              name="languages"
              value={userData.languages}
              onChange={handleChange}
              placeholder="E.g., English, French, Spanish"
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div className="personal-info">
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              maxLength={10}
              pattern="[+]{1}[0-9]{11,14}" // Validates numbers with a + at the start and a length between 11 and 14
              value={userData.phone}
              onChange={handleChange}
              onKeyDown={(e) => {
                // Allow numbers, Backspace, Delete, Tab, Arrow keys, and '+'
                if (
                  !/[\d+]/.test(e.key) && // Allow digits and '+'
                  e.key !== 'Backspace' &&
                  e.key !== 'Delete' &&
                  e.key !== 'ArrowLeft' &&
                  e.key !== 'ArrowRight' &&
                  e.key !== 'Tab'
                ) {
                  e.preventDefault();
                }
              }}
              readOnly={!isEditing}
            />
            {validationErrors.phone && (
              <span className="profile-error-text">{validationErrors.phone}</span>
            )}
          </div>

          <div>
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>
      </div>

      {/* Skills Section */}
      <div className="skills-section">
        <label htmlFor="skills">Skills</label>
        <input
          id="skills"
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
          {onboardingStep < 7 ? (
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