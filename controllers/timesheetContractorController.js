const TimesheetContractor = require("../models/timesheetContractorSchema");
const moment = require("moment-timezone");

const addTimesheet = async (req, res) => {
  try {
    const { employeeName, timeSheet } = req.body;
    
    if (!employeeName || !timeSheet) {
      return res.status(422).json({
        status: false,
        message: "Please provide all fields correctly",
      });
    }

    let StringDateToObject = timeSheet.Date;

    const dateString = StringDateToObject;
    const dateObject = moment.tz(dateString, "DD-MM-YYYY", "UTC").toDate();

    let newObject = {
      Date: dateObject,
      Task: timeSheet.Task,
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
      savedTimesheets,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getTimesheetForContractor = async (req, res) => {
  try {
    const { contractorName } = req.query;

    const savedTimesheets = await TimesheetContractor.find().populate(
      "EmployeeName"
    );
    
    if (savedTimesheets.length < 1) {
      return res.status(422).json({
        status: false,
        message: "There no timesheet present in collection",
      });
    }
    
     const filterData = savedTimesheets.filter((curr) => {
      return curr.EmployeeName.Contractor === contractorName;
    });

    return res.status(201).json({
      status: true,
      message: "succesfully fetched timesheet data",
      filterData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getSortedData = async (req, res) => {
  try {
    const { employeeName, startDateString, endDateString } = req.query;

    if (!startDateString || !endDateString || !employeeName) {
      return res.status(422).json({
        status: false,
        message: "startdate and enddate are not present",
      });
    }

    const startDate = moment.tz(startDateString, "DD-MM-YYYY", "UTC").toDate();
    const endDate = moment.tz(endDateString, "DD-MM-YYYY", "UTC").toDate();

    const savedTimesheet = await TimesheetContractor.find({
      EmployeeName: employeeName,
    }).populate("EmployeeName");

    const existingTimeSheetArr = savedTimesheet[0].Timesheet;
    const existingEmployeeName = savedTimesheet[0].EmployeeName;

    if (!existingEmployeeName || !existingEmployeeName) {
      return res
        .status(422)
        .json({ status: false, message: "no data is present" });
    }

    const filterSortedData = existingTimeSheetArr.filter((curr) => {
      return curr.Date >= startDate && curr.Date <= endDate;
    });

    const newObj = {
      EmployeeName: existingEmployeeName,
      Timesheet: filterSortedData,
    };

    if (newObj) {
      return res.status(201).json({
        status: true,
        message: "succesfully sorted timesheet",
        filterSortedData,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const editTimesheetDateForAdmin = async (req, res) => {
  try {
    const { employeeName, TimesheetDateId, customDate, Task, Workinghours } =
      req.body;

    if (
      !TimesheetDateId ||
      !employeeName ||
      !customDate ||
      !Task ||
      !Workinghours
    ) {
      return res.status(422).json({
        status: false,
        message: "current date id is not given to update",
      });
    }

    let StringDateToObject = customDate;

    const dateString = StringDateToObject;
    const dateObject = moment.tz(dateString, "DD-MM-YYYY", "UTC").toDate();

    const updateResponse = await TimesheetContractor.updateOne(
      { EmployeeName: employeeName, "Timesheet._id": TimesheetDateId },
      {
        $set: {
          "Timesheet.$.Date": dateObject,
          "Timesheet.$.Task": Task,
          "Timesheet.$.Workinghours": Workinghours,
        },
      }
    );

    if (updateResponse.acknowledged === true) {
      return res
        .status(201)
        .json({ status: true, message: "Date is updated succesfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong" });
  }
};

const editTimesheetDateForContractor = async (req, res) => {
    try {
    const { employeeName, TimesheetDateId, Task, Workinghours } = req.body;

    if (!TimesheetDateId || !Task || !Workinghours) {
      return res.status(422).json({
        status: false,
        message: "current date id is not given to update",
      });
    }

    const existingTimesheet = await TimesheetContractor.findOne({
      "Timesheet._id": TimesheetDateId,
    });

    if (!existingTimesheet) {
      return res
        .status(422)
        .json({ status: false, message: "No Timeheet present with given id" });
    }

    const timesheet = existingTimesheet.Timesheet;

    timesheet.map(async (curr) => {
      if (curr._id == TimesheetDateId) {
        if (curr.Approve) {
          return res.status(422).json({
            status: false,
            message: "Admin has approved timesheet and cannot be editable",
          });
        } else {
          const updateResponse = await TimesheetContractor.updateOne(
            { "Timesheet._id": TimesheetDateId },
            {
              $set: {
                "Timesheet.$.Task": Task,
                "Timesheet.$.Workinghours": Workinghours,
              },
            }
          );

          if (updateResponse.acknowledged === true) {
            return res
              .status(201)
              .json({ status: true, message: "Date is updated succesfully" });
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong" });
  }
};

const approveTimesheetFromAdmin = async (req, res) => {
  try {
    const { TimesheetId } = req.body;

    const updateApprove = await TimesheetContractor.updateOne(
      { "Timesheet._id": TimesheetId },
      {
        $set: {
          "Timesheet.$.Approve": true,
        },
      }
    );

    if (updateApprove.acknowledged === true) {
      return res
        .status(201)
        .json({ status: true, message: "Approve successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = {
  addTimesheet,
  getTimesheet,
  getTimesheetForContractor,
  getSortedData,
  editTimesheetDateForAdmin,
  editTimesheetDateForContractor,
  approveTimesheetFromAdmin
};
