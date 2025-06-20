// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Only for local testing!

// const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
// require('dotenv').config();

// // Plaid client setup
// const config = new Configuration({
//   basePath: PlaidEnvironments.sandbox,
//   baseOptions: {
//     headers: {
//       'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
//       'PLAID-SECRET': process.env.PLAID_SECRET,
//     },
//   },
// });
// const plaidClient = new PlaidApi(config);

// // Generate a sandbox access token dynamically
// async function getSandboxAccessToken() {
//   const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
//     institution_id: 'ins_109508', // Plaid's test institution
//     initial_products: ['transactions'],
//   });
//   const publicToken = publicTokenResponse.data.public_token;

//   const accessTokenResponse = await plaidClient.itemPublicTokenExchange({
//     public_token: publicToken,
//   });

//   return accessTokenResponse.data.access_token;
// }

// // Save transactions stub
// async function saveTransactionsToDb(userId, transactions) {
//   for (const tx of transactions) {
//     // await db.insertTransaction({ userId, ...tx });
//   }
// }

// // The transaction sync function now takes users as a parameter
// async function syncAllUserTransactions(users) {
//   for (const user of users) {
//     try {
//       const startDate = '2025-06-15'; // Use a dynamic date if needed
//       const endDate = new Date().toISOString().split('T')[0];

//       // Fetch transactions from Plaid
//       const response = await plaidClient.transactionsGet({
//         access_token: user.accessToken,
//         start_date: startDate,
//         end_date: endDate,
//         options: {
//           count: 100,
//           offset: 0,
//         },
//       });

//       const transactions = response.data.transactions;

//       console.log(`Plaid response for user ${user.userId}:`);
//       console.dir(response.data, { depth: null, maxArrayLength: null });

//       await saveTransactionsToDb(user.userId, transactions);

//       console.log(`Synced ${transactions.length} transactions for user ${user.userId}`);
//     } catch (err) {
//       console.error(`Failed to sync for user ${user.userId}:`, err.response?.data || err.message);
//     }
//   }
// }

// // Main runner: get the sandbox token and trigger sync
// (async () => {
//   try {
//     const accessToken = await getSandboxAccessToken();
//     const users = [
//       { userId: 1, accessToken }, // you can add more if needed
//     ];
//     await syncAllUserTransactions(users);
//   } catch (err) {
//     console.error('Error in sandbox sync:', err);
//   }
// })();

async function sandBoxSync() {
  try {
    const accessToken = await getSandboxAccessToken();
    const startDate = '2025-06-15';
    const endDate = new Date().toISOString().split('T')[0];

    // Try up to 5 times with 1 second between retries
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const response = await plaidClient.transactionsGet({
          access_token: accessToken,
          start_date: startDate,
          end_date: endDate,
          options: { count: 100, offset: 0 },
        });
        return {
          accounts: response.data.accounts,
          transactions: response.data.transactions,
          item: response.data.item,
          total_transactions: response.data.total_transactions,
          request_id: response.data.request_id,
        };
      } catch (err) {
        // If error is PRODUCT_NOT_READY, wait and retry
        if (err.response?.data?.error_code === 'PRODUCT_NOT_READY' && attempt < 4) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second
          continue;
        }
        // Otherwise, throw the error
        throw err;
      }
    }
    throw new Error('Plaid sandbox: Transactions not ready after retries.');
  } catch (err) {
    console.error('Plaid sandbox sync error:', err?.response?.data || err.message || err);
    throw new Error(
      err?.response?.data?.error_message ||
      err?.message ||
      'Unknown error in Plaid sandbox sync'
    );
  }
}

module.exports = { sandBoxSync };
