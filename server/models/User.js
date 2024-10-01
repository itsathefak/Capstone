const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

let userSchema = new Schema({
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
  phoneNumber: {
    type: String,
    required: true,
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
  role: {
    type: String,
    enum: ["Service Provider", "Customer"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", // Reference to the Booking model
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
