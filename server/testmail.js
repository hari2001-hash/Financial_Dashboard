require('dotenv').config();

const { sendBudgetAlertEmail } = require("./utils/email");


sendBudgetAlertEmail("hh6995161@gmail.com", "TestBudget", 1000, 1200)
  .then(() => console.log("Test mail sent!"))
  .catch(err => console.error("Test mail error:", err));