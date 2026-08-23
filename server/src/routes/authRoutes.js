const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyAdmin2FA,
  sendMasterBypassOTP,
  verifyMasterBypassOTP,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-admin-2fa', verifyAdmin2FA);
router.post('/send-master-bypass-otp', sendMasterBypassOTP);
router.post('/verify-master-bypass-otp', verifyMasterBypassOTP);

module.exports = router;
