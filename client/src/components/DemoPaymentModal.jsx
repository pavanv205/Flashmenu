import React, { useState } from 'react';
import FlashLogoBadge from './FlashLogoBadge';
import { ShieldCheck, CheckCircle2, CreditCard, Lock, X, Loader2, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function DemoPaymentModal({ isOpen, onClose, planDetails, onSuccess }) {
  const { user, restaurant, updateRestaurantState } = useAuth();
  const [processing, setProcessing] = React.useState(false);

  const title = planDetails?.title || planDetails?.planName || 'Restaurant Plan';
  const amount = Number(planDetails?.amount ?? planDetails?.price ?? 1);
  const duration = planDetails?.duration || planDetails?.cycleName || 'Monthly';

  const handleRazorpayCheckout = React.useCallback(async () => {
    if (!planDetails) return;
    setProcessing(true);

    try {
      // 1. Create Order on Backend via Razorpay API
      const orderRes = await paymentAPI.createOrder({
        amount: planDetails.amount,
        planKey: planDetails.planKey,
        title: planDetails.title,
      });

      if (!orderRes.data || !orderRes.data.orderId) {
        throw new Error('Failed to initiate Razorpay order. Please try again.');
      }

      const { orderId, keyId, amount: razorpayAmount } = orderRes.data;

      // 2. Load Official Razorpay JS SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Failed to load Razorpay Payment Gateway. Please check your internet connection.');
      }

      const isSelectingLifetime =
        String(planDetails.duration || '').toLowerCase().includes('lifetime') ||
        String(planDetails.title || '').toLowerCase().includes('lifetime');

      // 3. Open Official Razorpay Live Checkout Modal Directly
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TAwDF3o7rjkreE',
        amount: razorpayAmount,
        currency: 'INR',
        name: 'FlashMenu Solutions',
        description: `${title} Subscription (${duration})`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planKey: planDetails.planKey,
              duration: planDetails.duration,
              title: planDetails.title,
              isLifetime: isSelectingLifetime,
            });

            const updatedRest = verifyRes.data?.restaurant || verifyRes.data;
            if (updatedRest && updateRestaurantState) {
              updateRestaurantState(updatedRest);
            }

            if (onSuccess) {
              await onSuccess(updatedRest || planDetails.planKey);
            }
            onClose();
          } catch (vErr) {
            alert(vErr.response?.data?.message || 'Payment verification failed. Please try again.');
            onClose();
          }
        },
        prefill: {
          name: restaurant?.name || user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#F59E0B',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            onClose();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setProcessing(false);
        alert(resp.error?.description || 'Payment failed or cancelled.');
        onClose();
      });
      rzp.open();
    } catch (err) {
      setProcessing(false);
      alert(err.response?.data?.message || err.message || 'Payment initiation failed.');
      onClose();
    }
  }, [planDetails, restaurant, user, updateRestaurantState, onSuccess, onClose, title, duration]);

  React.useEffect(() => {
    if (isOpen && planDetails) {
      handleRazorpayCheckout();
    }
  }, [isOpen, planDetails, handleRazorpayCheckout]);

  return null;
}
