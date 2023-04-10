const ContractorProfile = require("../models/contractorProfileSchema");

const contractorProfileController = async (req, res) => {
  try {
    const {
      contractorName,
      contractorEmail,
      companyName,
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
    
    console.log(contractorName,
      contractorEmail,
      companyName,
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
      panNo);

    if (
      !contractorName ||
      !contractorEmail ||
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

    const panNoExist = await ContractorProfile.findOne({ PanNo: panNo });
    const idNoExist = await ContractorProfile.findOne({ IdNo: idNo });

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

    const newProfile = new ContractorProfile({
      ContractorName: contractorName,
      ContractorEmail: contractorEmail,
      CompanyName: companyName,
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

const getCurrentContractorProfile = async (req, res) => {
  try {
    const loginUser = req.user.Email;

    if (!loginUser) {
      return res
        .status(422)
        .json({ status: false, message: "Invalid Employee" });
    }

    const savedContractorProfile = await ContractorProfile.findOne({
      ContractorEmail: loginUser,
    });

    if (!savedContractorProfile) {
      return res.status(422).json({
        status: false,
        message: "contractor profile is not present in database",
      });
    }

    return res.status(201).json({
      status: true,
      message: "successfull fetch contractor profile data",
      savedContractorProfile,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};


module.exports = { contractorProfileController, getCurrentContractorProfile }
