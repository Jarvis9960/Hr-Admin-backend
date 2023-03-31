const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  MobileNo: {
    type: Number,
    required: true,
  },
  JoinDate: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
  },
  Salary: {
    type: Number,
    required: true
  },
   Contractor: {
    type: String,
    required: true,
  },
});

const employee = mongoose.model("Employee", employeeSchema);

module.exports = employee;
