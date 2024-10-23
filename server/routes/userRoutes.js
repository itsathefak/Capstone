const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Register User
router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
    check("role", "Role is required").exists(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
  registerUser
);

// Login User
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
  loginUser
);

router.post("/logout", protect, logoutUser);

router.get("/userProfile", protect, getUserProfile);

// Update user profile (PUT or PATCH request)
router.put('/updateProfile', protect, updateUserProfile);


// Protected route example
router.get("/protected", protect, (req, res) => {
  res.json({
    status: "success",
    msg: "You have access to this protected route!",
    userId: req.user.id,
  });
});

module.exports = router;
