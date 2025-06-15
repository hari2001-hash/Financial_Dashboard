const cron = require('node-cron');
// Import your transaction sync logic
const { syncAllUserTransactions } = require('./services/transactionSync');

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Starting daily transaction sync at', new Date().toISOString());
  try {
    await syncAllUserTransactions();
    console.log('Daily transaction sync complete');
  } catch (err) {
    console.error('Error during transaction sync:', err);
  }
});