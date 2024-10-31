const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  const token = req.cookies.token; // Access the cookie

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", msg: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from the database using the user ID in the token
    req.user = await User.findById(decoded.id).select("-password"); // Exclude password from the result

    if (!req.user) {
      return res
        .status(401)
        .json({ status: "error", msg: "Unauthorized: User not found" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err.message);

        // Differentiate between token expiration and other errors
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: "error", msg: "Unauthorized: Token has expired" });
    }

    return res
      .status(401)
      .json({ status: "error", msg: "Unauthorized: Invalid token" });
  }
};
