"use strict";
const nodemailer = require("nodemailer");

export async function sendContactMail(
  email: string,
  firstName: string,
  lastName: string,
  subject: string,
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
    subject: `Contact Form: ${subject}`, // Subject line
    text: "", // plain text body
    html: `Contact form complete from ${email}. <br/><br/> Content: ${content}`, // html body
  };
  const mailOptions2 = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: `Contact Form Reply`, // Subject line
    text: "", // plain text body
    html: `Hi ${firstName} ${lastName}! <br/><br/> I got your contact form completion, I'll reply as soon as I can.<br/><br/>I hope you are well, <br/>Edutech Support`, // html body
  };

  let info = await transporter.sendMail(mailOptions);
  let info2 = await transporter.sendMail(mailOptions2);

  console.log("Message sent: %s", info.messageId);
  console.log("Message sent: %s", info2.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info2));
}
