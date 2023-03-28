const mongoose = require("mongoose");

const timesheetVendorSchema = new mongoose.Schema({
  Vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  Timesheet: [
    {
      Date: {
        type: Date,
      },
      Task: {
        type: String,
      },
      Workinghours: {
        type: String,
      },
    },
  ],
});

const TimesheetVendor = mongoose.model(
  "TimesheetVendor",
  timesheetVendorSchema
);

module.exports = TimesheetVendor;