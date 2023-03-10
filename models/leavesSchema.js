const mongoose = require("mongoose");


const leaveSchema = new mongoose.Schema({
    EmployeeName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    LeaveType: {
        type: String,
        required: true
    },
    From: {
        type: String,
        required: true
    },
    To: {
        type: String,
        required: true
    },
    NoOfDays: {
        type: String,
        required: true
    },
    Reason: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        default: "Pending"
    }
})


const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;