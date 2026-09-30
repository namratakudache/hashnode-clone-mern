const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    // required: false,
  },
  profileImage: {
    type: String,
    // required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
