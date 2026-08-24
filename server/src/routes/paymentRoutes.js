const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { optionalProtect } = require('../middleware/auth');

router.post('/create-order', optionalProtect, createOrder);
router.post('/verify-payment', optionalProtect, verifyPayment);

module.exports = router;
