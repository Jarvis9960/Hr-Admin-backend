const Profile = require("../models/profileSchema");
const Employee = require("../models/EmployeeSchema");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dmq6xw2ux",
  api_key: "739671846821257",
  api_secret: "udhZGXBeBbM4-PCWhwO77_0G0Ww",
});

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

//     const panImage = req.files.Panimage[0];
//     const adharImage = req.files.Adharimage[0];

//     if (!panImage) {
//       return res
//         .status(422)
//         .json({ status: false, message: "Pan image is not uploaded" });
//     }

//     const panimageNameArr = panImage.originalname.split(".");
//     const panOriginalName = panimageNameArr[0];
//     const adharImageNameArr = adharImage.originalname.split(".");
//     const adharOriginalName = adharImageNameArr[0];

//     const Panresp = cloudinary.uploader.upload(panImage.path, {
//       public_id: panOriginalName,
//     });

//     Panresp.then((data) => {
//       console.log(data.secure_url);
//     }).catch((err) => {
//       return res
//         .status(422)
//         .json({ status: false, message: "image uploads failed" });
//     });

//     const Adharresp = cloudinary.uploader.upload(adharImage.path, {
//       public_id: adharOriginalName,
//     });

//     Adharresp.then((data) => {
//       console.log(data.secure_url);
//     }).catch((err) => {
//       return res
//         .status(422)
//         .json({ status: false, message: "image uploads failed" });
//     });

//     let panSavedUrl = await cloudinary.url(panOriginalName, { secure: true });
//     let adharSavedUrl = await cloudinary.url(adharOriginalName, {
//       secure: true,
//     });

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
//       PanImage: panSavedUrl,
//       AdharImage: adharSavedUrl,
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

    const currentUser = await Employee.findOne({ Email: loginUser });

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
  }
};

const getEmployeeProfilebyId = async (req, res) => {
  try {
    const { profileId } = req.query;

    if (!profileId) {
      return res
        .status(422)
        .json({ status: false, message: "Profile ID is not givent" });
    }

    const savedEmployeeProfile = await Profile.findOne({
      _id: profileId,
    }).populate("EmployeeId");

    if (!savedEmployeeProfile) {
      return res
        .status(422)
        .json({
          status: false,
          message: "No profile is present with given Id",
        });
    }

    return res
      .status(201)
      .json({
        status: true,
        message: "successfully fetched Employee Profile",
        savedEmployeeProfile,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = {
  addemployeeProfileController,
  getCurrentEmployeeProfile,
  getAllEmployeeProfiles,
  getEmployeeProfilebyId
};
