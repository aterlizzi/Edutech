"use strict";
const nodemailer = require("nodemailer");

export async function sendChangePassMail(
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
    subject: "Password Changed", // Subject line
    text: "", // plain text body
    html: `Hi ${username}<br/><br/> Your password has been successfully changed at Edutech. <br/><br/> If this was not you, please <a href="${url}">change your password</a> immediately to secure your account.`, // html body
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
