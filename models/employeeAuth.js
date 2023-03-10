const mongoose = require("mongoose");

const employeeAuth = new mongoose.Schema({
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

const EmployeeAuth = mongoose.model("EmployeeAuth", employeeAuth);

module.exports = EmployeeAuth;