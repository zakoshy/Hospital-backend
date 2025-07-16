const axios = require('axios');
const { consumerKey, consumerSecret, oauthUrl } = require('../config/darajaConfig');

async function generateToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  console.log('\n========== DARAJA TOKEN DEBUG ==========');
  console.log('Consumer Key:', consumerKey);
  console.log('Consumer Secret:', consumerSecret);
  console.log('Auth header:', auth);
  console.log('OAuth URL:', oauthUrl);

  try {
    const response = await axios.get(oauthUrl, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    console.log('✅ Token Response:', response.data);
    console.log('========== END TOKEN DEBUG ==========\n');

    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error generating token:', error.response?.data || error.message);
    throw new Error('Failed to generate Daraja OAuth token');
  }
}

module.exports = generateToken;
