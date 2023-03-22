const mongoose = require("mongoose");

const timeseetContractorSchema = new mongoose.Schema({
  EmployeeName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  Timesheet: [
    {
      Date: {
        type: String,
      },
      Workinghours: {
        type: String,
      },
    },
  ],
});

const TimesheetContractor = mongoose.model(
  "Timesheetcontractor",
  timeseetContractorSchema
);

module.exports = TimesheetContractor;
