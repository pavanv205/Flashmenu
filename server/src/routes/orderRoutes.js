const express = require('express');
const router = express.Router();
const { getRestaurantOrders, getOrderHistory, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRestaurantOrders);
router.get('/history', protect, getOrderHistory);
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
