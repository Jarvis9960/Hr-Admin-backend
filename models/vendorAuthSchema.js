const mongoose = require("mongoose");

const VendorAuthSchema = new mongoose.Schema({
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

const VendorAuth = mongoose.model("VendorAuth", VendorAuthSchema);

module.exports = VendorAuth;