const employeeWorkingHour = require("../models/employeeWorkingHourSchema");

const getEmployeeWorkingHourByEmail = async (req, res) => {
  try {
 
    const { Email } = req.params;

    if (!Email) {
      return res
        .status(422)
        .json({ status: false, message: "Employee email is not provided" });
    }

    const savedEmployeeWorkingHour = await employeeWorkingHour.findOne({
      EmployeeEmail: Email,
    }).populate("Employee");


    if (!savedEmployeeWorkingHour) {
      return res.status(422).json({
        status: false,
        message: "No Working hour is present in collection",
      });
    } else {
      return res.status(201).json({
        status: true,
        message: "Successfully fetched working hour",
        savedEmployeeWorkingHour,
      });
    }
  } catch (error) {
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = { getEmployeeWorkingHourByEmail }
