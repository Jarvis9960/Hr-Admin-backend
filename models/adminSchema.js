const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  forgotPassToken: {
    type: String,
    default: "",
  },
});

const admin = mongoose.model("Admin", adminSchema);

module.exports = admin;
