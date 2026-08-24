const Razorpay = require('razorpay');
const crypto = require('crypto');
const Restaurant = require('../models/Restaurant');
const mockStore = require('../config/mockStore');
const { connectDB, getIsConnected } = require('../config/db');

const cleanCred = (val, fallback = '') => {
  if (!val) return fallback;
  return String(val).replace(/["'\r\n\s]/g, '').trim() || fallback;
};

const getRazorpayCredentials = () => {
  const key_id = cleanCred(process.env.RAZORPAY_KEY_ID, 'rzp_live_TAwDF3o7rjkreE');
  const key_secret = cleanCred(process.env.RAZORPAY_KEY_SECRET, 'KOrClbC6FdKfH1XcUTyDFUeY');
  return { key_id, key_secret };
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

    const { key_id, key_secret } = getRazorpayCredentials();

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
      console.error('Razorpay Order Creation Error:', rzpErr);
      return res.status(500).json({ message: `Razorpay Order Error: ${rzpErr.message}` });
    }
  } catch (error) {
    console.error('Create Payment Order Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required Razorpay payment signature details' });
    }

    if (!planKey) {
      return res.status(400).json({ message: 'Plan details missing for verification' });
    }

    const { key_secret } = getRazorpayCredentials();
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Update restaurant subscription plan in Database
    const { duration, title, isLifetime: reqIsLifetime } = req.body;

    const isLifetime =
      reqIsLifetime === true ||
      String(duration || '').toLowerCase().includes('lifetime') ||
      String(title || '').toLowerCase().includes('lifetime');

    const startDate = new Date();

    await connectDB();

    let updatedRestaurant = null;

    if (getIsConnected() && req.user?._id) {
      const existingRest = await Restaurant.findOne({ ownerId: req.user._id });

      const isSelectingPremium = String(planKey || '').toLowerCase().includes('premium') || String(title || '').toLowerCase().includes('premium');
      const finalPlan = isSelectingPremium ? 'premium' : 'basic';

      const finalIsLifetime = isLifetime;
      const finalCycle = finalIsLifetime ? 'lifetime' : '4min';
      const finalExpiresAt = finalIsLifetime
        ? null
        : new Date(Date.now() + 4 * 60 * 1000);

      const updatePayload = {
        $set: {
          subscriptionPlan: finalPlan,
          subscriptionCycle: finalCycle,
          subscriptionStartDate: startDate,
          isActive: true,
        },
      };

      if (finalIsLifetime) {
        updatePayload.$set.subscriptionExpiresAt = null;
        updatePayload.$unset = { subscriptionExpiresAt: 1 };
      } else {
        updatePayload.$set.subscriptionExpiresAt = finalExpiresAt;
      }

      updatedRestaurant = await Restaurant.findOneAndUpdate(
        { ownerId: req.user._id },
        updatePayload,
        { new: true }
      );
    } else if (req.user?._id) {
      const r = mockStore.restaurants.find((res) => String(res.ownerId) === String(req.user._id));
      if (r) {
        const isExistingPremium = r.subscriptionPlan === 'premium';
        const finalPlan = isExistingPremium ? 'premium' : updatedPlan;
        const isAlreadyLifetime = r.subscriptionCycle === 'lifetime';
        const finalIsLifetime = isLifetime || isAlreadyLifetime;

        r.subscriptionPlan = finalPlan;
        r.subscriptionCycle = finalIsLifetime ? 'lifetime' : '1month';
        r.subscriptionStartDate = startDate;
        r.subscriptionExpiresAt = finalIsLifetime ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
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
