
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
//   try {
//     const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
//       institution_id: 'ins_109508', // Plaid's test institution
//       initial_products: ['transactions'],
//     });
//     const publicToken = publicTokenResponse.data.public_token;

//     const accessTokenResponse = await plaidClient.itemPublicTokenExchange({
//       public_token: publicToken,
//     });

//     return accessTokenResponse.data.access_token;
//   } catch (err) {
//     console.error('Error getting Plaid sandbox access token:', err.response?.data || err.message);
//     throw err;
//   }
// }

// // Save transactions stub (implement DB logic)
// async function saveTransactionsToDb(userId, transactions) {
//   // Example stub: replace with your actual DB logic
//   // for (const tx of transactions) {
//   //   await db.insertTransaction({ userId, ...tx });
//   // }
// }

// // Helper to fetch transactions with retry logic
// async function fetchTransactionsWithRetry(plaidClient, accessToken, startDate, endDate, maxAttempts = 5, delayMs = 2000) {
//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     try {
//       const response = await plaidClient.transactionsGet({
//         access_token: accessToken,
//         start_date: startDate,
//         end_date: endDate,
//         options: { count: 100, offset: 0 },
//       });
//       return response.data.transactions;
//     } catch (err) {
//       const errorCode = err.response?.data?.error_code;
//       if (errorCode === 'PRODUCT_NOT_READY' && attempt < maxAttempts) {
//         console.log(`Transactions not ready, retrying in ${delayMs / 1000} seconds... (attempt ${attempt})`);
//         await new Promise(res => setTimeout(res, delayMs));
//         continue;
//       }
//       throw err;
//     }
//   }
//   throw new Error('Plaid transactions not ready after multiple attempts.');
// }

// // The transaction sync function
// async function syncAllUserTransactions(users) {
//   for (const user of users) {
//     try {
//       const startDate = '2025-06-15'; // Use a dynamic date if needed
//       const endDate = new Date().toISOString().split('T')[0];

//       // Fetch transactions from Plaid with retry logic
//       const transactions = await fetchTransactionsWithRetry(
//         plaidClient,
//         user.accessToken,
//         startDate,
//         endDate,
//         5,      // maxAttempts
//         2000    // delayMs
//       );

//       console.log(`Plaid transactions for user ${user.userId}:`);
//       console.dir(transactions, { depth: null, maxArrayLength: null });

//       await saveTransactionsToDb(user.userId, transactions);

//       console.log(`Synced ${transactions.length} transactions for user ${user.userId}`);
//     } catch (err) {
//       if (err.response?.data) {
//         console.error(`Failed to sync for user ${user.userId}:`, err.response.data);
//       } else {
//         console.error(`Failed to sync for user ${user.userId}:`, err.message);
//       }
//     }
//   }
// }

// // Main runner: get the sandbox token and trigger sync
// async function sandBoxSync() {
//   try {
//     const accessToken = await getSandboxAccessToken();
//     const users = [
//       { userId: 1, accessToken }, // Add more users as needed
//     ];
//     await syncAllUserTransactions(users);
//   } catch (err) {
//     console.error('Error in sandbox sync:', err);
//   }
//    return transactionsArray;
// }

// // Export the main function for use in your server
// module.exports = { sandBoxSync, getSandboxAccessToken };



process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Only for local testing!

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

// Plaid client setup
const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});
const plaidClient = new PlaidApi(config);

// Generate a sandbox access token dynamically
async function getSandboxAccessToken() {
  try {
    const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
      institution_id: 'ins_109508', // Plaid's test institution
      initial_products: ['transactions'],
    });
    const publicToken = publicTokenResponse.data.public_token;

    const accessTokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return accessTokenResponse.data.access_token;
  } catch (err) {
    console.error('Error getting Plaid sandbox access token:', err.response?.data || err.message);
    throw err;
  }
}

// Save transactions stub (implement DB logic)
async function saveTransactionsToDb(userId, transactions) {
  // Example stub: replace with your actual DB logic
  // for (const tx of transactions) {
  //   await db.insertTransaction({ userId, ...tx });
  // }
}

// Helper to fetch transactions with retry logic
async function fetchTransactionsWithRetry(plaidClient, accessToken, startDate, endDate, maxAttempts = 5, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: { count: 100, offset: 0 },
      });
      return response.data.transactions;
    } catch (err) {
      const errorCode = err.response?.data?.error_code;
      if (errorCode === 'PRODUCT_NOT_READY' && attempt < maxAttempts) {
        console.log(`Transactions not ready, retrying in ${delayMs / 1000} seconds... (attempt ${attempt})`);
        await new Promise(res => setTimeout(res, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Plaid transactions not ready after multiple attempts.');
}

// The transaction sync function
async function syncAllUserTransactions(users) {
  const allTransactions = [];
  for (const user of users) {
    try {
      const startDate = '2025-06-15'; // Use a dynamic date if needed
      const endDate = new Date().toISOString().split('T')[0];

      // Fetch transactions from Plaid with retry logic
      const transactions = await fetchTransactionsWithRetry(
        plaidClient,
        user.accessToken,
        startDate,
        endDate,
        5,      // maxAttempts
        2000    // delayMs
      );

      console.log(`Plaid transactions for user ${user.userId}:`);
      console.dir(transactions, { depth: null, maxArrayLength: null });

      await saveTransactionsToDb(user.userId, transactions);

      console.log(`Synced ${transactions.length} transactions for user ${user.userId}`);

      // Collect transactions for return
      allTransactions.push(...transactions);
    } catch (err) {
      if (err.response?.data) {
        console.error(`Failed to sync for user ${user.userId}:`, err.response.data);
      } else {
        console.error(`Failed to sync for user ${user.userId}:`, err.message);
      }
    }
  }
  return allTransactions;
}

// Main runner: get the sandbox token and trigger sync
async function sandBoxSync() {
  try {
    const accessToken = await getSandboxAccessToken();
    const users = [
      { userId: 1, accessToken }, // Add more users as needed
    ];
    // Collect and return all transactions
    const transactionsArray = await syncAllUserTransactions(users);
    return transactionsArray;
  } catch (err) {
    console.error('Error in sandbox sync:', err);
    return [];
  }
}

// Export the main function for use in your server
module.exports = { sandBoxSync, getSandboxAccessToken };