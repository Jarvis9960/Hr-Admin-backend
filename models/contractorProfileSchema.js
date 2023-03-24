const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema({
  ContractorName: {
    type: String,
    required: true,
  },
  CompanyName: {
    type: String,
    required: true,
  },
  ContractorEmail: {
    type: String,
    required: true
  },
  JoinDate: {
    type: String,
    required: true,
  },
  BeneficiaryName: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
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

const ContractorProfile = mongoose.model("ContractorProfile", contractorSchema);

module.exports = ContractorProfile;
