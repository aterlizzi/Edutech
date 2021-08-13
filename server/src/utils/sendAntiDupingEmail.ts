"use strict";
const nodemailer = require("nodemailer");

export async function sendAntiDupingMail(email: string, username: string) {
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
    subject: "Suspicious Activity", // Subject line
    text: "", // plain text body
    html: `Hi ${username}! <br/><br/> We picked up on a suspicious request using your referral code. If you weren't trying to use a referral code you can ignore this email. <br/><br/> If you were trying to use your account's referral code for another account of yours, I've got some bad news. We only allow referrals for unique accounts. <br/><br/> If you think is some kind of mistake, please reply to this email so that we can get it worked out. <br/><br/> Hope you are well, <br/> Edutech Referral Support`, // html body
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
