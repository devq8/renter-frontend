// const nodemailer = require("nodemailer");

// const sendEmail = async (formData) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "mail.wuc.com.kw",
//       port: 465,
//       secure: true,
//       auth: {
//         user: "info@wuc.com.kw",
//         pass: "your-email-password",
//       },
//     });

//     await transporter.sendMail({
//       from: "info@wuc.com.kw",
//       to: "khaled@wuc.com.kw",
//       subject: `Message from ${formData.name} (${formData.email})`,
//       text: formData.message,
//     });

//     console.log("Email sent successfully!");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// module.exports = sendEmail;
