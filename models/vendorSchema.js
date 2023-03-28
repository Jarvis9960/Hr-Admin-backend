const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  VendorName: {
    type: String,
    required: true,
  },
  VendorEmail: {
    type: String,
    required: true,
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
