const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  updateRestaurantPlan,
  toggleRestaurantStatus,
  deleteRestaurant,
  createRestaurantOwner,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/restaurants', getAllRestaurants);
router.post('/create-owner', createRestaurantOwner);
router.put('/restaurants/:id/plan', updateRestaurantPlan);
router.put('/restaurants/:id/status', toggleRestaurantStatus);
router.delete('/restaurants/:id', deleteRestaurant);

module.exports = router;
