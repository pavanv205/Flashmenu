const express = require('express');
const router = express.Router();
const { getDashboardOverview, resolveWaiterCall, getFeedbackList } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, getDashboardOverview);
router.patch('/waiter-call/:id/resolve', protect, resolveWaiterCall);
router.get('/feedback', protect, getFeedbackList);

module.exports = router;
