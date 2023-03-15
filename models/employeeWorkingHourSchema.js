const mongoose = require("mongoose");

const employeeWorkingHourSchema = new mongoose.Schema({
  Employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  EmployeeEmail: {
    type: String,
  },
  Timesheet: [
    {
      Workinghours: {
        type: String,
      },
      CurrentDate: {
        type: String,
      },
    },
  ],
});

const employeeWorkingHour = mongoose.model(
  "WorkingHour",
  employeeWorkingHourSchema
);

module.exports = employeeWorkingHour;
