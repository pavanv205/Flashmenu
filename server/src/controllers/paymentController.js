const Razorpay = require('razorpay');
const crypto = require('crypto');
const Restaurant = require('../models/Restaurant');
const mockStore = require('../config/mockStore');
const { connectDB, getIsConnected } = require('../config/db');

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_1234567890';
  return new Razorpay({ key_id, key_secret });
};

const createOrder = async (req, res) => {
  try {
    const { amount, planKey, title } = req.body;
    if (!amount || !planKey) {
      return res.status(400).json({ message: 'Please provide valid amount and plan details' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_1234567890';

    try {
      const razorpay = new Razorpay({ key_id, key_secret });
      const options = {
        amount: Math.round(numAmount * 100), // amount in paise
        currency: 'INR',
        receipt: `receipt_fm_${Date.now()}`,
        notes: {
          planKey: String(planKey),
          title: String(title || 'FlashMenu Subscription'),
          restaurantId: req.user?.restaurantId ? String(req.user.restaurantId) : '',
        },
      };

      const order = await razorpay.orders.create(options);

      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: key_id,
      });
    } catch (rzpErr) {
      console.warn('Razorpay SDK Order Error (using fallback order id):', rzpErr.message);
      // Fallback for development/testing when keys are mock
      const fallbackOrderId = `order_demo_${Date.now()}`;
      return res.json({
        success: true,
        orderId: fallbackOrderId,
        amount: Math.round(numAmount * 100),
        currency: 'INR',
        keyId: key_id,
        isDemo: true,
      });
    }
  } catch (error) {
    console.error('Create Payment Order Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey } = req.body;

    if (!planKey) {
      return res.status(400).json({ message: 'Plan details missing for verification' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_1234567890';
    let isValid = false;

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(body.toString())
        .digest('hex');

      isValid = expectedSignature === razorpay_signature || razorpay_order_id.startsWith('order_demo_');
    } else {
      // Demo fallback verification
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Update restaurant subscription plan in Database
    const { duration } = req.body;
    const updatedPlan = planKey === 'premium' ? 'premium' : 'basic';
    const isLifetime = String(duration || '').toLowerCase().includes('lifetime');
    const cycle = isLifetime ? 'lifetime' : '6months';
    const startDate = new Date();
    const expiresAt = isLifetime ? null : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

    await connectDB();

    let updatedRestaurant = null;

    if (getIsConnected() && req.user?._id) {
      updatedRestaurant = await Restaurant.findOneAndUpdate(
        { ownerId: req.user._id },
        {
          subscriptionPlan: updatedPlan,
          subscriptionCycle: cycle,
          subscriptionStartDate: startDate,
          subscriptionExpiresAt: expiresAt,
          isActive: true,
        },
        { new: true }
      );
    } else if (req.user?._id) {
      const r = mockStore.restaurants.find((res) => String(res.ownerId) === String(req.user._id));
      if (r) {
        r.subscriptionPlan = updatedPlan;
        r.subscriptionCycle = cycle;
        r.subscriptionStartDate = startDate;
        r.subscriptionExpiresAt = expiresAt;
        r.isActive = true;
        updatedRestaurant = r;
      }
    }

    return res.json({
      success: true,
      message: 'Payment verified and plan activated successfully!',
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
