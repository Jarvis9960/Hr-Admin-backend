const Holiday = require("../models/HolidaySchema");

const holidayController = async (req, res) => {
  try {
    const { holidayName, holidayDate, holidayDay } = req.body;

    if (!holidayName || !holidayDate || !holidayDay) {
      return res
        .status(422)
        .json({ status: false, message: "please filled required details" });
    }

    const newHoliday = new Holiday({
      HolidayName: holidayName,
      HolidayDate: holidayDate,
      HolidayDay: holidayDay,
    });

    const savedHoliday = await newHoliday.save();

    if (savedHoliday) {
      return res.status(201).json({
        status: true,
        message: "Holiday added Successfully",
        savedholiday: savedHoliday,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getHoliday = async (req, res) => {
  try {
    const getHolidays = await Holiday.find();

    if (!getHolidays) {
      return res
        .status(501)
        .json({ status: false, message: "No data in Holidays" });
    } else {
      return res.status(201).json({
        status: true,
        message: "successfully fetched Holiday Data",
        savedHolidays: getHolidays,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = { holidayController, getHoliday };
