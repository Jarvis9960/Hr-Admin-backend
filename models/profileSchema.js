const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  Team: {
    type: String,
    required: true,
  },
  Birthday: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  ReportTo: {
    type: String,
    required: true,
  },
  IdNo: {
    type: String,
    required: true,
  },
  Nationality: {
    type: String,
    required: true,
  },
  Religion: {
    type: String,
    required: true,
  },
  MartialStatus: {
    type: String,
    required: true,
  },
  EmergencyContactName: {
    type: String,
    required: true,
  },
  EmergencyContactRelationship: {
    type: String,
    required: true,
  },
  EmergencyContactNumber: {
    type: Number,
    required: true,
  },
  BankName: {
    type: String,
    required: true,
  },
  BankAccNo: {
    type: String,
    required: true,
  },
  IFSCcode: {
    type: String,
    required: true,
  },
  PanNo: {
    type: String,
    required: true,
  },
});

const Profile = mongoose.model("employeeprofile", profileSchema);


module.exports = Profile;
