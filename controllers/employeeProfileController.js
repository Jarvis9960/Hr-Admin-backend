const Profile = require("../models/profileSchema");
const Employee = require("../models/EmployeeSchema");

const addemployeeProfileController = async (req, res) => {
  try {
    const loginUser = req.user.Email;

    const currentEmployee = await Employee.findOne({ Email: loginUser });

    const EmployeeId = currentEmployee._id;

    if (!EmployeeId) {
      return res.status(422).json({
        status: false,
        message: "Employee data is not present in database",
      });
    }

    const {
      team,
      birthday,
      address,
      gender,
      reportTo,
      idNo,
      nationality,
      religion,
      martialStatus,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactNumber,
      bankName,
      bankAccNo,
      isfcCode,
      panNo,
    } = req.body;

    console.log(team, birthday, address, gender, reportTo, idNo, nationality, religion, martialStatus, emergencyContactName, emergencyContactRelation, emergencyContactNumber, bankAccNo, bankName, isfcCode, panNo)

    if (
      !team ||
      !birthday ||
      !address ||
      !gender ||
      !reportTo ||
      !idNo ||
      !nationality ||
      !religion ||
      !martialStatus ||
      !emergencyContactName ||
      !emergencyContactRelation ||
      !emergencyContactNumber ||
      !bankName ||
      !bankAccNo ||
      !isfcCode ||
      !panNo
    ) {
      return res.status(422).json({
        status: false,
        message: "Please filled required field Properly",
      });
    }

    const panNoExist = await Profile.findOne({ PanNo: panNo });
    const idNoExist = await Profile.findOne({ IdNo: idNo });

    if (panNoExist || idNoExist) {
      return res.status(422).json({
        status: false,
        message:
          "pan number or adhar number you have register are assiocate with another employee",
      });
    }

    const newProfile = new Profile({
      EmployeeId: EmployeeId,
      Team: team,
      Birthday: birthday,
      Address: address,
      Gender: gender,
      ReportTo: reportTo,
      IdNo: idNo,
      Nationality: nationality,
      Religion: religion,
      MartialStatus: martialStatus,
      EmergencyContactName: emergencyContactName,
      EmergencyContactRelationship: emergencyContactRelation,
      EmergencyContactNumber: emergencyContactNumber,
      BankName: bankName,
      BankAccNo: bankAccNo,
      IFSCcode: isfcCode,
      PanNo: panNo,
    });

    const savedProfile = await newProfile.save();

    if (savedProfile) {
      return res.status(201).json({
        status: true,
        message: "profile updated successfully",
        profileData: savedProfile,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getCurrentEmployeeProfile = async (req, res) => {
  try {
    const loginUser = req.user.Email;

    if (!loginUser) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid Employee" });
    }

    const currentUser = await Employee.findOne({Email: loginUser});

    const currentUserId = currentUser._id;

    const savedEmployeeProfile = await Profile.findOne({
      EmployeeId: currentUserId,
    }).populate("EmployeeId");

    if (!savedEmployeeProfile) {
      return res
        .status(422)
        .json({ status: false, message: "Profile is not present in database" });
    } else {
      return res.status(201).json({
        status: true,
        message: "successfully fetched Profile",
        res: savedEmployeeProfile,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

const getAllEmployeeProfiles = async (req, res) => {
  try {
    const response = await Profile.find().populate("EmployeeId");

    if (!response) {
      return res
        .status(422)
        .json({ status: false, message: "not profile data is available" });
    }

    return res.status(201).json({
      status: true,
      message: "succesfully fetch employee profile",
      resp: response,
    });
  } catch (error) {
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });

module.exports = { addemployeeProfileController, getCurrentEmployeeProfile, getAllEmployeeProfiles}
