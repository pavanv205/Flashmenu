const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  duplicateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMenuItems);
router.post('/', protect, createMenuItem);
router.put('/reorder', protect, reorderMenuItems);
router.patch('/:id/toggle-available', protect, toggleAvailability);
router.post('/:id/duplicate', protect, duplicateMenuItem);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;
