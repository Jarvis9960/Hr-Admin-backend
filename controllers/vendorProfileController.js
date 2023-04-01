const VendorProfile = require("../models/vendorProfileSchema");
const Vendor = require("../models/vendorSchema");

const vendorProfileController = async (req, res) => {
  try {
    const loginUser = req.user.Email;

    const currentVendor = await Vendor.findOne({ Email: loginUser });

    const vendorId = currentVendor._id;

    if (!vendorId) {
      return res.status(422).json({
        status: false,
        message: "Employee data is not present in database",
      });
    }
    const {
      companyName,
      gst,
      joinDate,
      beneficiaryName,
      role,
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
      !companyName ||
      !joinDate ||
      !beneficiaryName ||
      !role ||
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

    const panNoExist = await VendorProfile.findOne({ PanNo: panNo });
    const idNoExist = await VendorProfile.findOne({ IdNo: idNo });

    if (panNoExist || idNoExist) {
      return res.status(422).json({
        status: false,
        message:
          "pan number or adhar number you have register are assiocate with another employee",
      });
    }

    const panImage = req.files.Panimage[0];
    const adharImage = req.files.Adharimage[0];

    if (!panImage || !adharImage) {
      return res
        .status(422)
        .json({ status: false, message: "Pan or adhar image is not uploaded" });
    }

    const panImageUrl = panImage.path;
    const adharImageUrl = adharImage.path;

    const newProfile = new VendorProfile({
      Vendor: vendorId,
      CompanyName: companyName,
      GST: gst,
      JoinDate: joinDate,
      BeneficiaryName: beneficiaryName,
      Role: role,
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
      PanImage: panImageUrl,
      AdharImage: adharImageUrl,
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

const getCurrentVendorProfile = async (req, res) => {
  try {
    const loginUser = req.user.Email;

    if (!loginUser) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid Employee" });
    }

    const currentUser = await Vendor.findOne({ Email: loginUser });

    const currentUserId = currentUser._id;

    const savedVendorProfile = await VendorProfile.findOne({
      Vendor: currentUserId,
    }).populate("Vendor");

    if (!savedVendorProfile) {
      return res
        .status(422)
        .json({ status: false, message: "Profile is not present in database" });
    } else {
      return res.status(201).json({
        status: true,
        message: "successfully fetched Profile",
        res: savedVendorProfile,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};


module.exports = { vendorProfileController, getCurrentVendorProfile}
