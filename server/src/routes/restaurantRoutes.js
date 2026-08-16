const express = require('express');
const router = express.Router();
const { getMyRestaurant, updateMyRestaurant } = require('../controllers/restaurantController');
const { protect } = require('../middleware/auth');

router.get('/my-restaurant', protect, getMyRestaurant);
router.put('/my-restaurant', protect, updateMyRestaurant);

module.exports = router;
