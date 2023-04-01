const mongoose = require("mongoose");

const vendorProfileSchema = new mongoose.Schema({
  Vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  CompanyName: {
    type: String,
    required: true,
  },
  GST: {
    type: Number,
    required: true,
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
   PanImage: {
    type: String,
  },
  AdharImage: {
    type: String,
  },
});

const VendorProfile = mongoose.model("VendorProfile", vendorProfileSchema);

module.exports = VendorProfile;
