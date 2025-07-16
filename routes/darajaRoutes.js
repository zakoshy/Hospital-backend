const express = require('express');
const router = express.Router();
const { getOAuthToken } = require('../controllers/darajaController');
const { stkPushRequest } = require('../controllers/darajaController');
const {stkCallbackHandler} = require('../controllers/darajaController');
// Test route to generate OAuth token
router.get('/token', getOAuthToken);

router.post('/stk-push', stkPushRequest);
router.post('/callback', stkCallbackHandler);


module.exports = router;
