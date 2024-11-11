const nodemailer = require("nodemailer");

const emailHelper = async (to, subject, text) => {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "juliteixido12@gmail.com",
      pass: "mwzr dzvx eksw rtpu",
    },
  });

  // Set up email options
  let mailOptions = {
    from: "juliteixido12@gmail.com",
    to: to,
    subject: subject,
    text: text,// ya tiene el cliente
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = emailHelper;