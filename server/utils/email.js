
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // set in your .env file
//     pass: process.env.EMAIL_PASS,
//   },
// });

// exports.sendBudgetAlertEmail = async (to, category, budget, spent) => {
//   // Log before sending mail
//   console.log("Calling sendBudgetAlertEmail for", to, category, budget, spent);

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject: `Budget Alert: ${category}`,
//     text: `Alert: You have exceeded your budget for ${category}!\n\nBudget: ₹${budget}\nSpent: ₹${spent}`,
//   };
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     // Log after mail is sent successfully
//     console.log("Mail sent: ", info.response);
//     return info;
//   } catch (err) {
//     // Log if sending fails
//     console.error("Error sending mail:", err);
//     throw err;
//   }
// };
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // set in your .env file
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a budget alert email.
 * @param {string} to - Recipient email
 * @param {string} category - Budget category
 * @param {number} budget - Budget total
 * @param {number} spent - Amount spent
 * @param {number} [percentUsed] - Fraction of budget used (e.g., 0.8 for 80%)
 * @param {number} [threshold] - Fraction at which the alert triggers (e.g., 0.8)
 */
exports.sendBudgetAlertEmail = async (to, category, budget, spent, percentUsed, threshold) => {
  console.log("Calling sendBudgetAlertEmail for", to, category, budget, spent, percentUsed, threshold);

  // Compose dynamic message
  let subject, text;
  if (percentUsed > 1) {
    subject = `Budget Alert: ${category} - Over Budget!`;
    text =
      `Alert: You have exceeded your budget for ${category}!\n\n` +
      `Budget: ₹${budget}\nSpent: ₹${spent}\n\n` +
      `Please review your expenses.`;
  } else if (threshold) {
    const percent = (threshold * 100).toFixed(0);
    subject = `Budget Warning: ${category} - ${percent}% Used`;
    text =
      `Warning: You have used ${percent}% of your budget for ${category}.\n\n` +
      `Budget: ₹${budget}\nSpent: ₹${spent}\n\n` +
      `Keep an eye on your spending.`;
  } else {
    subject = `Budget Alert: ${category}`;
    text =
      `You have received a budget alert for ${category}.\n\n` +
      `Budget: ₹${budget}\nSpent: ₹${spent}`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
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