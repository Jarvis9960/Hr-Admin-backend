const mongoose = require("mongoose");

const contractorAuthSchema = new mongoose.Schema({
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

const Contractor = mongoose.model("Contractor", contractorAuthSchema);

module.exports = Contractor;
