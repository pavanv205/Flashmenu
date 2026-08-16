const express = require('express');
const router = express.Router();
const { getRestaurantOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRestaurantOrders);
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
