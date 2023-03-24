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

    const panNoExist = await ContractorProfile.findOne({ PanNo: panNo });
    const idNoExist = await ContractorProfile.findOne({ IdNo: idNo });

    if (panNoExist || idNoExist) {
      return res.status(422).json({
        status: false,
        message:
          "pan number or adhar number you have register are assiocate with another employee",
      });
    }

    // const panImage = req.files.Panimage[0];
    // const adharImage = req.files.Adharimage[0];

    // if (!panImage) {
    //   return res
    //     .status(422)
    //     .json({ status: false, message: "Pan image is not uploaded" });
    // }

    // const panimageNameArr = panImage.originalname.split(".");
    // const panOriginalName = panimageNameArr[0];
    // const adharImageNameArr = adharImage.originalname.split(".");
    // const adharOriginalName = adharImageNameArr[0];

    // const Panresp = cloudinary.uploader.upload(panImage.path, {
    //   public_id: panOriginalName,
    // });

    // Panresp.then((data) => {
    //   console.log(data.secure_url);
    // }).catch((err) => {
    //   return res
    //     .status(422)
    //     .json({ status: false, message: "image uploads failed" });
    // });

    // const Adharresp = cloudinary.uploader.upload(adharImage.path, {
    //   public_id: adharOriginalName,
    // });

    // Adharresp.then((data) => {
    //   console.log(data.secure_url);
    // }).catch((err) => {
    //   return res
    //     .status(422)
    //     .json({ status: false, message: "image uploads failed" });
    // });

    // let panSavedUrl = await cloudinary.url(panOriginalName, { secure: true });
    // let adharSavedUrl = await cloudinary.url(adharOriginalName, {
    //   secure: true,
    // });

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


module.exports = { contractorProfileController }
