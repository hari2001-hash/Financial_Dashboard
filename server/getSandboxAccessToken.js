const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

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

async function getSandboxAccessToken() {
  // Step 1: Create a sandbox public token
  const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
    institution_id: 'ins_109508', // 'Platypus Bank' (Plaid sandbox test bank)
    initial_products: ['transactions'],
  });
  const publicToken = publicTokenResponse.data.public_token;

  // Step 2: Exchange the public token for an access token
  const accessTokenResponse = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });
  const accessToken = accessTokenResponse.data.access_token;
  console.log('Sandbox access token:', accessToken);
}

getSandboxAccessToken().catch(console.error);