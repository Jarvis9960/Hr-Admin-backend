const TimesheetContractor = require("../models/timesheetContractorSchema");

const addTimesheet = async (req, res) => {
  try {
    const { employeeName, timeSheet } = req.body;

    const employeeNameExist = TimesheetContractor.findOne({
      EmployeeName: employeeName,
    });

    if (!employeeNameExist) {
      const newEmployeeTimesheet = new TimesheetContractor({
        EmployeeName: employeeName,
        Timesheet: [timeSheet],
      });

      const savedNewEmployeeTimesheet = await newEmployeeTimesheet.save();

      console.log(savedNewEmployeeTimesheet);

      if (savedNewEmployeeTimesheet) {
        return res.status(201).json({
          status: true,
          message: "successfully created newTimesheet",
          savedNewEmployeeTimesheet,
        });
      }
    } else {
      const updateEmployeeTimesheet = await TimesheetContractor.updateOne(
        { EmployeeName: employeeName },
        { $push: { Timesheet: timeSheet } }
      );

      console.log(updateEmployeeTimesheet);

      if (updateEmployeeTimesheet) {
        return res
          .status(201)
          .json({ status: true, message: "successfully created timesheet" });
      }
    }
  } catch (error) {
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getTimesheet = async (req, res) => {
  try {
    const savedTimesheets = await TimesheetContractor.find().populate(
      "EmployeeName"
    );

    if (!savedTimesheets) {
      return res.status(422).json({
        status: false,
        message: "There no timesheet present in collection",
      });
    }

    return res
      .status(201)
      .json({
        status: true,
        message: "succesfully fetched timesheet data",
        savedTimesheets,
      });
  } catch (error) {
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = { addTimesheet, getTimesheet };
