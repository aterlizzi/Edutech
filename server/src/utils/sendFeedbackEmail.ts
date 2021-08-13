"use strict";
const nodemailer = require("nodemailer");

export async function sendUnsubscribeContentMail(
  username: string,
  content: string
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
    to: "act5@rice.edu", // list of receivers
    subject: "Unsubscribe Content", // Subject line
    text: "", // plain text body
    html: `${username}'s Reason for unsubscribing: <br/><br/> ${content}`, // html body
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
