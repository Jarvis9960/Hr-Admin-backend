const TimesheetContractor = require("../models/timesheetContractorSchema");
const moment = require("moment");

const addTimesheet = async (req, res) => {
  try {
    const { employeeName, timeSheet } = req.body;

    let StringDateToObject = timeSheet.Date;

    const dateString = StringDateToObject;
    const dateObject = moment(dateString, "DD-MM-YYYY").toDate();

    let newObject = {
      Date: dateObject,
      Workinghours: timeSheet.Workinghours,
    };

    const employeeNameExist = await TimesheetContractor.findOne({
      EmployeeName: employeeName,
    });

    if (!employeeNameExist) {
      const newEmployeeTimesheet = new TimesheetContractor({
        EmployeeName: employeeName,
        Timesheet: [newObject],
      });

      const savedNewEmployeeTimesheet = await newEmployeeTimesheet.save();

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
        { $push: { Timesheet: newObject } }
      );

      console.log(updateEmployeeTimesheet);

      if (updateEmployeeTimesheet) {
        return res.status(201).json({
          status: true,
          message: "successfully created timesheet",
          updateEmployeeTimesheet,
        });
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

    if (savedTimesheets.length < 1) {
      return res.status(422).json({
        status: false,
        message: "There no timesheet present in collection",
      });
    }

    return res.status(201).json({
      status: true,
      message: "succesfully fetched timesheet data",
      sortedData,
    });
  } catch (error) {
    console.log(error)
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = { addTimesheet, getTimesheet };
