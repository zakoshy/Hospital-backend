const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    console.log("✅ Twilio SMS sent:", message.sid);
    return message.sid;
  } catch (err) {
    console.error("❌ Twilio SMS error:", err);
    return null;
  }
};

module.exports = sendSMS;
