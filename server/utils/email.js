// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // set in your .env file
//     pass: process.env.EMAIL_PASS,
//   },
// });

// exports.sendBudgetAlertEmail = (to, category, budget, spent) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject: `Budget Alert: ${category}`,
//     text: `Alert: You have exceeded your budget for ${category}!\n\nBudget: ₹${budget}\nSpent: ₹${spent}`,
//   };
//   return transporter.sendMail(mailOptions);
// };


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // set in your .env file
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendBudgetAlertEmail = async (to, category, budget, spent) => {
  console.log("Calling sendBudgetAlertEmail for", to, category, budget, spent); // <-- Added log
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Budget Alert: ${category}`,
    text: `Alert: You have exceeded your budget for ${category}!\n\nBudget: ₹${budget}\nSpent: ₹${spent}`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent: ", info.response);
    return info;
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
};