require('dotenv').config();

module.exports = {
  consumerKey: process.env.DARAJA_CONSUMER_KEY,
  consumerSecret: process.env.DARAJA_CONSUMER_SECRET,
  oauthUrl: process.env.DARAJA_OAUTH_URL,
  passkey: process.env.DARAJA_PASSKEY,
  shortcode: process.env.DARAJA_SHORTCODE
};
