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

    if (getIsConnected()) {
      let targetRest = null;

      if (req.user?._id) {
        targetRest = await Restaurant.findOne({ ownerId: req.user._id });
      }

      const searchEmail = (req.user?.email || req.body?.email || '').toLowerCase().trim();
      if (!targetRest && searchEmail) {
        targetRest = await Restaurant.findOne({ email: searchEmail });
      }

      if (!targetRest && req.body?.restaurantId) {
        targetRest = await Restaurant.findById(req.body.restaurantId).catch(() => null);
      }

      if (!targetRest && req.body?.slug) {
        targetRest = await Restaurant.findOne({ slug: req.body.slug });
      }

      if (targetRest) {
        const isSelectingPremium = String(planKey || '').toLowerCase().includes('premium') || String(title || '').toLowerCase().includes('premium');
        const finalPlan = isSelectingPremium ? 'premium' : 'basic';
        const finalIsLifetime = isLifetime;
        const finalCycle = finalIsLifetime ? 'lifetime' : '6months';
        const finalExpiresAt = finalIsLifetime
          ? null
          : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

        targetRest.subscriptionPlan = finalPlan;
        targetRest.subscriptionCycle = finalCycle;
        targetRest.subscriptionStartDate = startDate;
        targetRest.subscriptionExpiresAt = finalExpiresAt;
        targetRest.isActive = true;
        targetRest.isPaid = true;

        updatedRestaurant = await targetRest.save();

        if (targetRest.ownerId) {
          await User.findByIdAndUpdate(targetRest.ownerId, { isActive: true }).catch(() => {});
        }
      }
    } else if (req.user?._id || req.body?.email) {
      const searchEmail = (req.user?.email || req.body?.email || '').toLowerCase().trim();
      const r = mockStore.restaurants.find((res) => 
        (req.user?._id && String(res.ownerId) === String(req.user._id)) ||
        (searchEmail && res.email && String(res.email).toLowerCase().trim() === searchEmail)
      );
      if (r) {
        const isSelectingPremium = String(planKey || '').toLowerCase().includes('premium') || String(title || '').toLowerCase().includes('premium');
        const finalPlan = isSelectingPremium ? 'premium' : 'basic';
        const finalIsLifetime = isLifetime;

        r.subscriptionPlan = finalPlan;
        r.subscriptionCycle = finalIsLifetime ? 'lifetime' : '6months';
        r.subscriptionStartDate = startDate;
        r.subscriptionExpiresAt = finalIsLifetime ? null : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
        r.isActive = true;
        r.isPaid = true;
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
