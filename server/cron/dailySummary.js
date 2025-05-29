const cron = require('node-cron');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { sendSummaryEmail } = require('../utils/email');

// Runs every day at 8am server time
cron.schedule('0 8 * * *', async () => {
  const users = await User.find({});
  for (const user of users) {
    // Get yesterday's transactions
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    const txs = await Transaction.find({
      userId: user._id,
      date: { $gte: start, $lt: end }
    });

    if (txs.length > 0) {
      await sendSummaryEmail(user.email, txs, start, end);
    }
  }
});