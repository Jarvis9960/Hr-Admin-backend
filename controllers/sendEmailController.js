const nodemailer = require("nodemailer");
const { readFileSync } = require("node:fs");

const sendTimesheetExcelController = async (req, res) => {
  try {
    const excelFile = req.file;

    if (!excelFile) {
      return res
        .status(422)
        .json({ status: false, message: "excel file is not given" });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "jarvis9960@gmail.com",
        pass: "fziodwamplapingv",
      },
    });

    let file = readFileSync(excelFile.path);

    let info = await transporter.sendMail({
      from: "jarvis9960@gmail.com", // sender address
      to: "ankitfukte11@gmail.com", // list of receivers
      subject: "Invoice", // Subject line
      // text: "Here is the link to reset you password", // plain text body
      html: `<p>Hello, You  requested to Excel file is here.</P>.`, // html body
      attachments: [
        {
          filename: excelFile.originalname,
          content: file,
        },
      ],
    });

    if (info.accepted.length > 0) {
      return res
        .status(200)
        .json({ status: true, Messgae: "email successfully sent to gmail" });
    } else {
      throw new Error("something went wrong");
    }
  } catch (error) {
    return res
      .status(422)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

module.exports = { sendTimesheetExcelController };
