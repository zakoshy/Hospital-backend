const axios = require('axios');
const generateToken = require('../utils/generateToken');
const {
  passkey,
  shortcode
} = require('../config/darajaConfig');

const getOAuthToken = async (req, res) => {
  try {
    const token = await generateToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const stkPushRequest = async (req, res) => {
  const { phone, amount } = req.body;

  console.log('\n========== STK PUSH DEBUG ==========');
  console.log('Received phone:', phone);
  console.log('Received amount:', amount);

  if (!phone || !amount) {
    console.log('❌ Missing phone or amount in request body!');
    return res.status(400).json({
      error: 'phone and amount are required'
    });
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:\.Z]/g, '')
    .slice(0, 14);

  console.log('Timestamp:', timestamp);

  const passwordString = shortcode + passkey + timestamp;
  const password = Buffer.from(passwordString).toString('base64');

  console.log('Shortcode:', shortcode);
  console.log('Passkey:', passkey);
  console.log('Password string before encoding:', passwordString);
  console.log('Password (Base64):', password);

  try {
    const token = await generateToken();

    console.log('Bearer token:', token);

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: 'https://79af111aa543.ngrok-free.app/api/daraja/callback',
      AccountReference: 'LabTest',
      TransactionDesc: 'Payment for lab test'
    };

    console.log('Payload being sent to STK:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('✅ STK Push Success:', response.data);
    console.log('========== END STK PUSH DEBUG ==========\n');

    res.json({
      message: 'STK Push sent successfully',
      data: response.data
    });

  } catch (error) {
    console.error('\n❌ STK Push Error:', error.response?.data || error.message);
    console.log('========== END STK PUSH DEBUG ==========\n');
    res.status(500).json({
      error: 'Failed to send STK Push',
      details: error.response?.data || error.message
    });
  }
};
const stkCallbackHandler = async (req, res) => {
  console.log('\n========== DARJA CALLBACK DEBUG ==========');
  console.log('Daraja Callback Payload:', JSON.stringify(req.body, null, 2));

  const callback = req.body?.Body?.stkCallback;
  if (!callback) {
    console.log('❌ Callback payload missing stkCallback object!');
    return res.status(400).json({ error: 'Invalid callback payload' });
  }

  const resultCode = callback.ResultCode;
  const resultDesc = callback.ResultDesc;
  const merchantRequestID = callback.MerchantRequestID;
  const checkoutRequestID = callback.CheckoutRequestID;

  console.log(`ResultCode: ${resultCode}`);
  console.log(`ResultDesc: ${resultDesc}`);

  if (resultCode === 0) {
    // Successful transaction
    const metadataItems = callback.CallbackMetadata?.Item || [];

    const extractItem = (name) =>
      metadataItems.find((item) => item.Name === name)?.Value || null;

    const amount = extractItem('Amount');
    const mpesaReceiptNumber = extractItem('MpesaReceiptNumber');
    const phoneNumber = extractItem('PhoneNumber');
    const transactionDate = extractItem('TransactionDate');

    console.log(`✅ Payment Successful:
      MerchantRequestID: ${merchantRequestID}
      CheckoutRequestID: ${checkoutRequestID}
      Amount: ${amount}
      Receipt: ${mpesaReceiptNumber}
      Phone: ${phoneNumber}
      TransactionDate: ${transactionDate}
    `);

    // 👉 TODO: Save transaction to database if you want
  } else {
    console.log(`❌ Payment Failed or Cancelled:
      MerchantRequestID: ${merchantRequestID}
      CheckoutRequestID: ${checkoutRequestID}
      ResultDesc: ${resultDesc}
    `);

    // 👉 TODO: Optionally save failed/cancelled transaction
  }

  res.status(200).json({ message: 'Callback received successfully' });
};

module.exports = {
  getOAuthToken,
  stkPushRequest,
  stkCallbackHandler,
};

