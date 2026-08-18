const express = require('express');
const router = express.Router();
const { getAllRestaurants, updateRestaurantPlan, deleteRestaurant } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/restaurants', getAllRestaurants);
router.put('/restaurants/:id/plan', updateRestaurantPlan);
router.delete('/restaurants/:id', deleteRestaurant);

module.exports = router;
