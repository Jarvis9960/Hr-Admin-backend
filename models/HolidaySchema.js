const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  HolidayName: {
    type: String,
    required: true,
  },
  HolidayDate: {
    type: String,
    required: true,
  },
  HolidayDay: {
    type: String,
    required: true,
  },
});


const holiday = mongoose.model("Holiday", holidaySchema);

module.exports = holiday;
