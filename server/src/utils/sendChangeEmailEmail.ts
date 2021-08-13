"use strict";
const nodemailer = require("nodemailer");

export async function sendChangeEmailMail(
  email: string,
  username: string,
  url: string
) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Verify Email", // Subject line
    text: "", // plain text body
    html: `Hi ${username}<br/><br/> Your email has been changed to this email at Edutech. <br/><br/> <a href=${url}>Click me to verify this email change.<a/>`, // html body
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
