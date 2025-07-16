const africastalking = require('africastalking');

// Configure credentials
const at = africastalking({
  apiKey: process.env.AT_API_KEY,       // 🔁 Use your Africa's Talking API key
  username: process.env.AT_USERNAME     // 🔁 "sandbox" for testing, or your app name in production
});

const sms = at.SMS;

// Send SMS Function
const sendSMS = async (to, message) => {
  try {
    const result = await sms.send({
      to: [to],
      message: message,
      from: process.env.AT_SHORTCODE || '' // Optional, only if you have a short code or sender ID
    });

    console.log('✅ Africa’s Talking SMS sent:', result);
    return result;
  } catch (err) {
    console.error('❌ Africa’s Talking SMS error:', err);
    return null;
  }
};

module.exports = sendSMS;
