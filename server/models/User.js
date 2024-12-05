const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

let userSchema = new Schema({
  userImage: {
    type: String, 
    default: "", 
  },  
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    // Renamed from phoneNumber to phone
    type: String,
    required: false,
  },
  address: {
    // Added address field
    type: String,
  },
  userImage: {
    type: String,
  },
  bio: {
    type: String,
  },
  skills: {
    type: [String],
  },
  experience: {
    type: String,
  },
  occupation: {
    type: String,
  },
  linkedIn: {
    type: String,
  },
  education: {
    type: String,
  },
  industry: {
    type: String,
  },
  languages: {
    type: [String], // Array to support multiple languages
  },    
  role: {
    type: String,
    enum: ["Service Provider", "User", "Admin"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
});

// Hash password before saving
userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});

let User = mongoose.model("User", userSchema);
module.exports = User;
