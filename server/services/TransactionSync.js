const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

// Plaid client setup
const config = new Configuration({
  basePath: PlaidEnvironments.sandbox, // or .production/.development
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});
const plaidClient = new PlaidApi(config);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


// --- Stub: Replace with your DB logic ---
async function getAllUsersWithPlaidAccessTokens() {
  return [
    { userId: 1, accessToken: 'access-sandbox-...' },
    { userId: 2, accessToken: 'access-sandbox-...' }
  ];
}

async function saveTransactionsToDb(userId, transactions) {
  for (const tx of transactions) {
    // await db.insertTransaction({ userId, ...tx });
  }
}
// --- End stubs ---

async function syncAllUserTransactions() {
  const users = await getAllUsersWithPlaidAccessTokens();
  for (const user of users) {
    try {
      const startDate = '2025-06-15'; // You may want to use dynamic dates
      const endDate = new Date().toISOString().split('T')[0];

      // Fetch transactions from Plaid
      const response = await plaidClient.transactionsGet({
        access_token: user.accessToken,
        start_date: startDate,
        end_date: endDate,
        options: {
          count: 100, // max per request
          offset: 0,
        },
      });

      const transactions = response.data.transactions;

      // ---- LOGGING THE RESPONSE PAYLOAD ----
      console.log(`Plaid response for user ${user.userId}:`);
      // Log the entire response for auditing
      console.dir(response.data, { depth: null, maxArrayLength: null });
      // ---- END LOGGING ----

      await saveTransactionsToDb(user.userId, transactions);

      console.log(`Synced ${transactions.length} transactions for user ${user.userId}`);
    } catch (err) {
      console.error(`Failed to sync for user ${user.userId}:`, err.response?.data || err.message);
    }
  }
}

module.exports = { syncAllUserTransactions };