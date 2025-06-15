const { syncAllUserTransactions } = require('./services/TransactionSync');
syncAllUserTransactions();

async function getAllUsersWithPlaidAccessTokens() {
  return [
    { userId: 1, accessToken: 'access-sandbox-12345678-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
  ];
}