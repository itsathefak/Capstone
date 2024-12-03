const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create user instance
    user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password,
    });

    // Save the user
    await user.save();
    res.status(201).json({ msg: "User registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set the token in a cookie (optional, since you may want to store it in localStorage instead)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Send user data (without password) and token in response
    res.json({
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        skills: user.skills || [],
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ status: "success", msg: "Logged out successfully" });
};

// Get the logged-in user's profile
exports.getUserProfile = async (req, res) => {
  try {
    // Fetch user data from the database using the ID from the JWT token (req.user.id set by the auth middleware)
    const user = await User.findById(req.user.id).select("-password -__v");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return the user data
    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, bio, skills, experience, occupation, linkedIn, education, industry, languages } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, address, bio, skills, experience, occupation, linkedIn, education, industry, languages},
      { new: true, runValidators: true }
    );
    

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(updatedUser); // Return the updated user data
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
