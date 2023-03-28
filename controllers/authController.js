const bcrypt = require("bcrypt");
const admin = require("../models/adminSchema");
const EmployeeAuth = require("../models/employeeAuth")
const Contractor = require("../models/contractorAuth");
const VendorAuth = require("../models/vendorAuthSchema");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring")
const dotenv = require("dotenv")
const path = require("path")
dotenv.config({ path: path.resolve("./config.env") });


const registerController = async (req, res) => {
  try {
    const { email, password, cPassword } = req.body;

    const emailExists = await admin.findOne({ Email: email });

    if (emailExists) {
      return res
        .status(422)
        .json({ status: false, message: "user already exists please login" });
    }

    if (!email || !password || !cPassword) {
      return res
        .status(422)
        .json({ status: false, message: "Please field required field" });
    }

    if (password !== cPassword) {
      return res.status(422).json({
        status: false,
        message: "Password and confirm password are not matching",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newAdmin = new admin({
      Email: email,
      Password: hashPassword,
    });

    const response = await newAdmin.save();

    if (response) {
      res.status(200).json({
        status: true,
        message: "Admin successfully created",
        response,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ status: false, message: "Something went wrong" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ status: false, message: "please provide all required fields" });
    }

    const emailExists = await admin.findOne({ Email: email });

    if (!emailExists) {
      return res.status(422).json({
        status: false,
        message: "Admin is not registered please register first",
      });
    } else {
      const hashPassword = bcrypt.compareSync(password, emailExists.Password);

      if (emailExists.Email === email && hashPassword) {
        const token = jwt.sign(
          { admin_id: emailExists._id },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        res.cookie("Token", token, {
          httpOnly: true,
          secure: false,
        });

        return res.status(201).json({
          status: true,
          message: "Admin successfully logged IN",
          token: token,
        });
      } else {
        return res
          .status(422)
          .json({ status: false, message: "Invalid credential" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "something went wrong" });
  }
};


const forgotPasswordController = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      res.status(422).json({ message: "please provide email" });
    }

    const existingUser = await admin.findOne({ email: email });

    if (!existingUser) {
      res
        .status(422)
        .json({ message: "user doesn't exist please register first" });
    } else {
      const randomStringToken = randomString.generate();

      const response = await admin.updateOne(
        { email: email },
        { $set: { forgotPassToken: randomStringToken } },
        { new: true }
      );

      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "jarvis9960@gmail.com",
          pass: "msauwpetmsubwflq",
        },
      });

      let info = await transporter.sendMail({
        from: "jarvis9960@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Reset-Password", // Subject line
        // text: "Here is the link to reset you password", // plain text body
        html: `<p>Hello, You  requested to change your password in CRM. Here is the link for resetting your password</P>. <a href='https://localhttp://localhost:3000/resetpassword/${randomStringToken}'>Reset your password</a>`, // html body
      });

      if (info.accepted[0] === email && response.acknowledged === true) {
        return res
          .status(200)
          .json({ status: true, Messgae: "email successfully sent to gmail" });
      } else {
        throw new Error("something went wrong");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(442).json({
      status: false,
      Message: "something went wrong we couldn't process the reset link",
    });
  }
}

const resetPasswordController = async (req, res) => {
  try {
    const resetPassToken = req.params.token;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (!resetPassToken) {
      return res.status(422).json({
        status: false,
        Message:
          "Token is not provided generate new link for resetting password",
      });
    }

    if (!password || !cpassword) {
      return res.status(422).json({
        status: false,
        Message: "Please provide password and comfirm password field",
      });
    }

    const UserWhoWantPassChange = await admin.findOne({
      forgotPassToken: resetPassToken,
    });

    if (!UserWhoWantPassChange) {
      return res.status(422).json({
        Status: false,
        Message: "Token is expired Please generate your reset link again",
      });
    } else {
      if (password !== cpassword) {
        return res.status(422).json({
          Status: false,
          Message:
            "password and confirm password are not matching please check it again",
        });
      }

      const verifyPassword = bcrypt.compareSync(
        password,
        UserWhoWantPassChange.password
      );

      if (verifyPassword) {
        return res.status(422).json({
          status: false,
          Message: "password is same as your old password",
        });
      }

      let plainTextPassword = password;

      const salt = await bcrypt.genSaltSync(10);

      const securePassword = await bcrypt.hashSync(plainTextPassword, salt);

      const changesPassword = await admin.updateOne(
        { forgotPassToken: resetPassToken },
        { $set: { password: securePassword, forgotPassToken: "" } }
      );

      if (changesPassword.acknowledged === true) {
        return res
          .status(200)
          .json({ status: true, Message: "Password changes successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: false,
      Message: "something went wrong please reset your password again",
    });
  }
}

const loginControllerForEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ status: false, message: "please provide all required fields" });
    }

    const emailExists = await EmployeeAuth.findOne({ Email: email });

    if (!emailExists) {
      return res.status(422).json({
        status: false,
        message: "Employee is not registered please register first",
      });
    } else {
      const hashPassword = bcrypt.compareSync(password, emailExists.Password);

      if (emailExists.Email === email && hashPassword) {
        const token = jwt.sign(
          { Employee_id: emailExists._id },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        res.cookie("Token", token, {
          httpOnly: true,
          secure: false,
        });

        return res.status(201).json({
          status: true,
          message: "Rmployee successfully logged IN",
          token: token,
        });
      } else {
        return res
          .status(422)
          .json({ status: false, message: "Invalid credential" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "something went wrong" });
  }
};

const registerControllerForEmployee = async (req, res) => {
  try {
    const { email, password, cPassword } = req.body;

    const emailExists = await EmployeeAuth.findOne({ Email: email });

    if (emailExists) {
      return res
        .status(422)
        .json({ status: false, message: "user already exists please login" });
    }

    if (!email || !password || !cPassword) {
      return res
        .status(422)
        .json({ status: false, message: "Please field required field" });
    }

    if (password !== cPassword) {
      return res.status(422).json({
        status: false,
        message: "Password and confirm password are not matching",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newEmployee = new EmployeeAuth({
      Email: email,
      Password: hashPassword,
    });

    const response = await newEmployee.save();

    if (response) {
      res.status(200).json({
        status: true,
        message: "Employee account successfully created",
        response,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ status: false, message: "Something went wrong" });
  }
};

const forgotPasswordControllerForEmployee = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      res.status(422).json({ message: "please provide email" });
    }

    const existingUser = await EmployeeAuth.findOne({ email: email });

    if (!existingUser) {
      res
        .status(422)
        .json({ message: "user doesn't exist please register first" });
    } else {
      const randomStringToken = randomString.generate();

      const response = await EmployeeAuth.updateOne(
        { email: email },
        { $set: { forgotPassToken: randomStringToken } },
        { new: true }
      );

      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "jarvis9960@gmail.com",
          pass: "msauwpetmsubwflq",
        },
      });

      let info = await transporter.sendMail({
        from: "jarvis9960@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Reset-Password", // Subject line
        // text: "Here is the link to reset you password", // plain text body
        html: `<p>Hello, You  requested to change your password in CRM. Here is the link for resetting your password</P>. <a href='https://localhttp://localhost:3000/resetpassword/${randomStringToken}'>Reset your password</a>`, // html body
      });

      if (info.accepted[0] === email && response.acknowledged === true) {
        return res
          .status(200)
          .json({ status: true, Messgae: "email successfully sent to gmail" });
      } else {
        throw new Error("something went wrong");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(442).json({
      status: false,
      Message: "something went wrong we couldn't process the reset link",
    });
  }
}

const resetPasswordControllerForEmployee = async (req, res) => {
  try {
    const resetPassToken = req.params.token;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (!resetPassToken) {
      return res.status(422).json({
        status: false,
        Message:
          "Token is not provided generate new link for resetting password",
      });
    }

    if (!password || !cpassword) {
      return res.status(422).json({
        status: false,
        Message: "Please provide password and comfirm password field",
      });
    }

    const UserWhoWantPassChange = await EmployeeAuth.findOne({
      forgotPassToken: resetPassToken,
    });

    if (!UserWhoWantPassChange) {
      return res.status(422).json({
        Status: false,
        Message: "Token is expired Please generate your reset link again",
      });
    } else {
      if (password !== cpassword) {
        return res.status(422).json({
          Status: false,
          Message:
            "password and confirm password are not matching please check it again",
        });
      }

      const verifyPassword = bcrypt.compareSync(
        password,
        UserWhoWantPassChange.password
      );

      if (verifyPassword) {
        return res.status(422).json({
          status: false,
          Message: "password is same as your old password",
        });
      }

      let plainTextPassword = password;

      const salt = await bcrypt.genSaltSync(10);

      const securePassword = await bcrypt.hashSync(plainTextPassword, salt);

      const changesPassword = await EmployeeAuth.updateOne(
        { forgotPassToken: resetPassToken },
        { $set: { password: securePassword, forgotPassToken: "" } }
      );

      if (changesPassword.acknowledged === true) {
        return res
          .status(200)
          .json({ status: true, Message: "Password changes successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: false,
      Message: "something went wrong please reset your password again",
    });
  }
}

const loginControllerForContractor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ status: false, message: "please provide all required fields" });
    }

    const emailExists = await Contractor.findOne({ Email: email });

    if (!emailExists) {
      return res.status(422).json({
        status: false,
        message: "contractor is not registered please register first",
      });
    } else {
      const hashPassword = bcrypt.compareSync(password, emailExists.Password);

      if (emailExists.Email === email && hashPassword) {
        const token = jwt.sign(
          { contractor_id: emailExists._id },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        res.cookie("Token", token, {
          httpOnly: true,
          secure: false,
        });

        return res.status(201).json({
          status: true,
          message: "Contractor successfully logged IN",
          token: token,
        });
      } else {
        return res
          .status(422)
          .json({ status: false, message: "Invalid credential" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "something went wrong" });
  }
};

const registerControllerForContractor = async (req, res) => {
  try {
    const { email, password, cPassword } = req.body;

    const emailExists = await Contractor.findOne({ Email: email });

    if (emailExists) {
      return res
        .status(422)
        .json({
          status: false,
          message: "contractor already exists please login",
        });
    }

    if (!email || !password || !cPassword) {
      return res
        .status(422)
        .json({ status: false, message: "Please field required field" });
    }

    if (password !== cPassword) {
      return res.status(422).json({
        status: false,
        message: "Password and confirm password are not matching",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newContractor = new Contractor({
      Email: email,
      Password: hashPassword,
    });

    const response = await newContractor.save();

    if (response) {
      res.status(200).json({
        status: true,
        message: "contractor account successfully created",
        response,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ status: false, message: "Something went wrong" });
  }
};

const loginControllerForVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ status: false, message: "please provide all required fields" });
    }

    const emailExists = await VendorAuth.findOne({ Email: email });

    if (!emailExists) {
      return res.status(422).json({
        status: false,
        message: "Admin is not registered please register first",
      });
    } else {
      const hashPassword = bcrypt.compareSync(password, emailExists.Password);

      if (emailExists.Email === email && hashPassword) {
        const token = jwt.sign(
          { vendor_id: emailExists._id },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        res.cookie("Token", token, {
          httpOnly: true,
          secure: false,
        });

        return res.status(201).json({
          status: true,
          message: "vendor successfully logged IN",
          token: token,
        });
      } else {
        return res
          .status(422)
          .json({ status: false, message: "Invalid credential" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "something went wrong" });
  }
};

const registerControllerForVendor = async (req, res) => {
  try {
    const { email, password, cPassword } = req.body;

    const emailExists = await VendorAuth.findOne({ Email: email });

    if (emailExists) {
      return res
        .status(422)
        .json({ status: false, message: "user already exists please login" });
    }

    if (!email || !password || !cPassword) {
      return res
        .status(422)
        .json({ status: false, message: "Please field required field" });
    }

    if (password !== cPassword) {
      return res.status(422).json({
        status: false,
        message: "Password and confirm password are not matching",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newVendor = new VendorAuth({
      Email: email,
      Password: hashPassword,
    });

    const response = await newVendor.save();

    if (response) {
      res.status(200).json({
        status: true,
        message: "vendor successfully created",
        response,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(422).json({ status: false, message: "Something went wrong" });
  }
};


module.exports = { registerController, loginController, forgotPasswordController, resetPasswordController, loginControllerForEmployee, registerControllerForEmployee, forgotPasswordControllerForEmployee, resetPasswordControllerForEmployee, loginControllerForContractor,
  registerControllerForContractor, loginControllerForVendor, registerControllerForVendor };
