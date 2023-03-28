const TimesheetVendor = require("../models/timesheetVendorSchema");
const moment = require("moment-timezone");

const addTimesheetForVendor = async (req, res) => {
  try {
    const { employeeName, timeSheet } = req.body;

    let StringDateToObject = timeSheet.Date;

    const dateString = StringDateToObject;
    const dateObject = moment.tz(dateString, "DD-MM-YYYY", "UTC").toDate();

    let newObject = {
      Date: dateObject,
      Task: timeSheet.Task,
      Workinghours: timeSheet.Workinghours,
    };

    const employeeNameExist = await TimesheetVendor.findOne({
      Vendor: employeeName,
    });

    if (!employeeNameExist) {
      const newEmployeeTimesheet = new TimesheetVendor({
        Vendor: employeeName,
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
      const updateEmployeeTimesheet = await TimesheetVendor.updateOne(
        { Vendor: employeeName },
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

const getTimesheetForVendor = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res
        .status(422)
        .json({ status: false, message: "vendor id is not present" });
    }

    const savedVendorTimesheet = await TimesheetVendor.findOne({
      Vendor: vendorId,
    }).populate("Vendor");

    if (!savedVendorTimesheet) {
      return res.status(422).json({
        status: false,
        message: "no timesheet present in collection for current vendor",
      });
    }

    return res.status(201).json({
      status: true,
      message: "successfully fetched timesheet",
      savedVendorTimesheet,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getSortedDataForVendor = async (req, res) => {
  try {
    const { vendorId, startDateString, endDateString } = req.query;

    if (!startDateString || !endDateString || !vendorId) {
      return res.status(422).json({
        status: false,
        message: "startdate and enddate are not present",
      });
    }

    const startDate = moment.tz(startDateString, "DD-MM-YYYY", "UTC").toDate();
    const endDate = moment.tz(endDateString, "DD-MM-YYYY", "UTC").toDate();

    const savedTimesheet = await TimesheetVendor.find({
      Vendor: vendorId,
    }).populate("Vendor");

    const existingTimeSheetArr = savedTimesheet[0].Timesheet;
    const existingEmployeeName = savedTimesheet[0].Vendor;

    if (!existingEmployeeName || !existingEmployeeName) {
      return res
        .status(422)
        .json({ status: false, message: "no data is present" });
    }

    const filterSortedData = existingTimeSheetArr.filter((curr) => {
      return curr.Date > startDate && curr.Date < endDate;
    });

    const newObj = {
      Vendor: existingEmployeeName,
      Timesheet: filterSortedData,
    };

    if (newObj) {
      return res.status(201).json({
        status: true,
        message: "succesfully sorted timesheet",
        newObj,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const editTimesheetDateForVendor = async (req, res) => {
    try {
      const { vendorId, TimesheetDateId, Task, Workinghours } =
        req.body;
  
      if (
        !TimesheetDateId ||
        !Task ||
        !Workinghours
      ) {
        return res.status(422).json({
          status: false,
          message: "current date id is not given to update",
        });
      }
  
      // let StringDateToObject = customDate;
  
      // const dateString = StringDateToObject;
      // const dateObject = moment.tz(dateString, "DD-MM-YYYY", "UTC").toDate();
  
      const updateResponse = await TimesheetVendor.updateOne(
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
    } catch (error) {
      console.log(error);
      return res
        .status(422)
        .json({ status: false, message: "something went wrong" });
    }
  };

module.exports = { addTimesheetForVendor, getTimesheetForVendor, getSortedDataForVendor, editTimesheetDateForVendor };
