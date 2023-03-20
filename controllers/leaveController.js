const employee = require("../models/EmployeeSchema");
const Leave = require("../models/leavesSchema");

const leaveController = async (req, res) => {
  try {
    const { leaveType, from, to, noOfDays, reason } = req.body;

    const currentUserEmail = req.user.Email;

    if (!leaveType || !from || !to || !noOfDays || !reason) {
      return res.status(422).json({
        status: false,
        message: "Please filled required fields properly",
      });
    }

    const currentUser = await employee.findOne({ Email: currentUserEmail });

    if (!currentUser) {
      return res
        .status(404)
        .json({ status: false, message: "Employee is not in database" });
    }

    const currentUserId = currentUser._id;

    const newLeave = new Leave({
      EmployeeName: currentUserId,
      LeaveType: leaveType,
      From: from,
      To: to,
      NoOfDays: noOfDays,
      Reason: reason,
    });

    const savedLeave = await newLeave.save();

    if (savedLeave) {
      return res.status(201).json({
        status: true,
        message: "Leave added successfully",
        leave: savedLeave,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getAllEmployeeLeave = async (req, res) => {
  try {
    
    if(!req.user){
      return res.status(422).json({status: false, message: "employee can't access to this data" });
    }
   
    const savedLeaves = await Leave.find().populate("EmployeeName");

    if (savedLeaves) {
      return res.status(201).json({
        status: true,
        message: "successfully fetched leaves data",
        savedLeaves,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getEmployeeLeaveById = async (req, res) => {
  try {
    const currentUserEmail = req.user.Email;

    const currentEmployee = await employee.findOne({ Email: currentUserEmail });

    const currentEmployeeId = currentEmployee._id;

    const savedLeaves = await Leave.find({
      EmployeeName: currentEmployeeId,
    }).populate("EmployeeName");

    if (savedLeaves) {
      return res.status(201).json({
        status: true,
        message: "successfully fetched current user leaves",
        leaves: savedLeaves,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const updateEmployeeLeaveStatus = async (req, res) => {
  try {
    const { employeeId, status } = req.body;

    if (!employeeId || !status) {
      return res.status(422).json({
        status: false,
        message: "Please provide valid details to update",
      });
    }

    const updatedLeave = await Leave.updateOne(
      { _id: employeeId },
      { $set: { Status: status } }
    );

    if (updatedLeave) {
      return res
        .status(201)
        .json({ status: true, message: "Leave status successfully updated" });
    }
  } catch (error) {
    console.log(err);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = { leaveController, getAllEmployeeLeave, getEmployeeLeaveById, updateEmployeeLeaveStatus };
