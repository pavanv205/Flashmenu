const express = require('express');
const router = express.Router();
const {
  getPublicMenu,
  callWaiter,
  submitFeedback,
  createPublicOrder,
} = require('../controllers/publicController');

router.get('/menu/:slug', getPublicMenu);
router.post('/call-waiter', callWaiter);
router.post('/feedback', submitFeedback);
router.post('/order', createPublicOrder);

module.exports = router;
