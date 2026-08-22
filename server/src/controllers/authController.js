const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const mockStore = require('../config/mockStore');
const { createSlug } = require('../utils/slugify');
const { connectDB, getIsConnected } = require('../config/db');
const { defaultCategories } = require('../utils/defaultMenu');

const generateToken = (id, restaurantId = '', slug = '') => {
  return jwt.sign({ id, restaurantId, slug }, process.env.JWT_SECRET || 'flashmenu_secret_key', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, restaurantName, city, address, subscriptionPlan } = req.body;

    if (!name || !email || !password || !restaurantName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const normalizedEmail = String(email || '').toLowerCase().trim();
    const plan = subscriptionPlan === 'premium' ? 'premium' : 'basic';

    await connectDB();

    if (getIsConnected()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ message: 'This email is already registered. Click "Sign In" below to log in to your account.' });
      }

      let baseSlug = createSlug(restaurantName);
      if (!baseSlug || baseSlug.length < 2) {
        baseSlug = `restaurant-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      let slug = baseSlug;
      let attempts = 0;
      while (await Restaurant.findOne({ slug })) {
        attempts++;
        slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
        if (attempts > 10) break;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? String(phone).trim() : '',
      });

      const restaurant = await Restaurant.create({
        ownerId: user._id,
        name: String(restaurantName).trim(),
        slug,
        city: city ? String(city).trim() : '',
        address: address ? String(address).trim() : '',
        phone: phone ? String(phone).trim() : '',
        email: normalizedEmail,
        subscriptionPlan: plan,
      });

      // Lazy/background seed default starter categories and items
      const { ensureDefaultMenuForRestaurant } = require('../utils/seedHelper');
      ensureDefaultMenuForRestaurant(restaurant._id).catch(() => {});

      const token = generateToken(user._id, restaurant._id, restaurant.slug);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          slug: restaurant.slug,
          subscriptionPlan: restaurant.subscriptionPlan || 'basic',
        },
      });
    } else {
      // In-Memory Fallback
      const existing = mockStore.users.find(
        (u) => u && u.email && String(u.email).toLowerCase().trim() === normalizedEmail
      );
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      let slug = createSlug(restaurantName);
      if (mockStore.restaurants.some((r) => r && r.slug && String(r.slug).toLowerCase() === slug)) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = {
        _id: `user_${Date.now()}`,
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? String(phone).trim() : '',
        role: 'owner',
      };
      mockStore.users.push(user);

      const restaurant = {
        _id: `rest_${Date.now()}`,
        ownerId: user._id,
        name: String(restaurantName).trim(),
        slug,
        city: city ? String(city).trim() : '',
        address: address ? String(address).trim() : '',
        phone: phone ? String(phone).trim() : '',
        email: normalizedEmail,
        cuisineType: 'Multi-Cuisine',
        openingHours: '10:00 AM - 11:00 PM',
        primaryColor: '#F59E0B',
        currency: '₹',
        tableCount: 20,
        isOpen: true,
        subscriptionPlan: plan,
      };
      mockStore.restaurants.push(restaurant);

      defaultCategories.forEach((catData, catIdx) => {
        const c = {
          _id: `cat_${Date.now()}_${catIdx}`,
          restaurantId: restaurant._id,
          name: catData.name,
          order: catData.order,
          isActive: true,
        };
        mockStore.categories.push(c);

        if (catData.items && catData.items.length > 0) {
          catData.items.forEach((item, itemIdx) => {
            mockStore.menuItems.push({
              _id: `item_${Date.now()}_${catIdx}_${itemIdx}`,
              restaurantId: restaurant._id,
              categoryId: c._id,
              subCategory: item.subCategory || '',
              name: item.name,
              description: item.description || '',
              price: item.price,
              image: item.image || '',
              vegType: item.vegType || 'veg',
              spicyLevel: item.spicyLevel || 0,
              isBestseller: Boolean(item.isBestseller),
              isChefSpecial: Boolean(item.isChefSpecial),
              isAvailable: true,
              order: itemIdx + 1,
            });
          });
        }
      });

      const token = generateToken(user._id, restaurant._id, restaurant.slug);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          slug: restaurant.slug,
          subscriptionPlan: restaurant.subscriptionPlan || 'basic',
        },
      });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      if (error.keyPattern?.email || error.message?.includes('email')) {
        return res.status(400).json({ message: 'This email address is already registered. Please sign in.' });
      }
      if (error.keyPattern?.slug || error.message?.includes('slug')) {
        return res.status(400).json({ message: 'Restaurant name slug is already taken. Please try a slightly different name.' });
      }
      return res.status(400).json({ message: 'An account with these details already exists.' });
    }
    res.status(500).json({ message: error.message || 'Failed to create restaurant account. Please try again.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const normalizedEmail = String(email || '').toLowerCase().trim();

    await connectDB();

    if (getIsConnected()) {
      let user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });

      // Master Admin is EXCLUSIVELY pavanvadapalli26@gmail.com / Pavan@2193
      if (normalizedEmail === 'pavanvadapalli26@gmail.com') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Pavan@2193', salt);
        if (!user) {
          user = await User.create({
            name: 'Pavan Vadapalli (Master Admin)',
            email: 'pavanvadapalli26@gmail.com',
            password: hashedPassword,
            phone: '+919999999999',
            role: 'admin',
          });
        } else {
          user.role = 'admin';
          user.password = hashedPassword;
          await user.save();
        }
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (user.role === 'admin' && normalizedEmail !== 'pavanvadapalli26@gmail.com') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Enforce 2FA OTP verification for Master Admin role
      if (user.role === 'admin') {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.adminOtpCode = otpCode;
        user.adminOtpExpires = Date.now() + 600000; // 10 minutes TTL
        await user.save();

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F17; color: #FFFFFF; padding: 30px; border-radius: 16px; border: 1px solid #1F2937;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #F59E0B; margin: 0; font-size: 28px;">FlashMenu</h1>
              <p style="color: #9CA3AF; font-size: 14px; margin-top: 4px;">Master Admin Security System</p>
            </div>
            
            <h2 style="color: #FFFFFF; font-size: 20px; font-weight: bold;">Master Admin 2FA Code</h2>
            <p style="color: #D1D5DB; font-size: 14px; line-height: 1.6;">Hello <strong>Pavan Vadapalli</strong>,</p>
            <p style="color: #D1D5DB; font-size: 14px; line-height: 1.6;">You are attempting to log in to the Master Admin Portal. Please enter the security verification code below to gain access:</p>
            
            <div style="text-align: center; margin: 28px 0;">
              <p style="color: #9CA3AF; font-size: 12px; margin-bottom: 8px; font-weight: bold; text-transform: uppercase;">Your 6-Digit Admin 2FA Code</p>
              <div style="background-color: #111827; border: 2px solid #F59E0B; display: inline-block; padding: 14px 28px; font-size: 32px; font-weight: 900; color: #F59E0B; letter-spacing: 6px; border-radius: 12px;">
                ${otpCode}
              </div>
            </div>

            <p style="color: #6B7280; font-size: 12px; text-align: center; margin-top: 24px; border-t: 1px solid #1F2937; pt-16;">
              This code will expire in 10 minutes.<br/>If you did not request this login, please change your password immediately.
            </p>
          </div>
        `;

        await sendEmail({
          to: user.email,
          subject: 'FlashMenu - Master Admin 2FA Verification Code',
          html,
        });

        return res.json({
          requires2FA: true,
          email: user.email,
          message: 'Security 2FA verification code sent to pavanvadapalli26@gmail.com',
        });
      }

      let restaurant = await Restaurant.findOne({ ownerId: user._id });
      if (!restaurant && user.role !== 'admin') {
        const baseSlug = createSlug(user.name || 'my-restaurant');
        let slug = baseSlug;
        let attempts = 0;
        while (await Restaurant.findOne({ slug })) {
          attempts++;
          slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
          if (attempts > 10) break;
        }

        restaurant = await Restaurant.create({
          ownerId: user._id,
          name: user.name ? `${user.name}'s Kitchen` : 'My Restaurant',
          slug,
          email: user.email,
          phone: user.phone || '',
          subscriptionPlan: 'basic',
        });
      }

      const token = generateToken(user._id, restaurant?._id || '', restaurant?.slug || '');

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: restaurant
          ? {
              _id: restaurant._id,
              name: restaurant.name,
              slug: restaurant.slug,
              subscriptionPlan: restaurant.subscriptionPlan || 'basic',
            }
          : null,
      });
    } else {
      const user = mockStore.users.find(
        (u) => u && u.email && String(u.email).toLowerCase().trim() === normalizedEmail
      );
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (user.role === 'admin') {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.adminOtpCode = otpCode;
        user.adminOtpExpires = Date.now() + 600000;
        return res.json({
          requires2FA: true,
          email: user.email,
          message: 'Security 2FA verification code sent to pavanvadapalli26@gmail.com',
        });
      }

      const restaurant = mockStore.restaurants.find((r) => r && String(r.ownerId) === String(user._id));
      const token = generateToken(user._id, restaurant?._id || '', restaurant?.slug || '');

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: restaurant
          ? {
              _id: restaurant._id,
              name: restaurant.name,
              slug: restaurant.slug,
              subscriptionPlan: restaurant.subscriptionPlan || 'basic',
            }
          : null,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyAdmin2FA = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide both email and 2FA verification code' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedOtp = String(otp).trim();

    await connectDB();

    if (getIsConnected()) {
      const user = await User.findOne({
        email: normalizedEmail,
        role: 'admin',
        adminOtpCode: normalizedOtp,
        adminOtpExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid or expired 2FA verification code.' });
      }

      // Clear OTP on successful verification
      user.adminOtpCode = null;
      user.adminOtpExpires = null;
      await user.save();

      const token = generateToken(user._id, '', '');

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: null,
      });
    } else {
      const user = mockStore.users.find(
        (u) => u && String(u.email).toLowerCase().trim() === normalizedEmail && u.role === 'admin'
      );
      if (!user || user.adminOtpCode !== normalizedOtp) {
        return res.status(401).json({ message: 'Invalid or expired 2FA verification code.' });
      }

      user.adminOtpCode = null;
      user.adminOtpExpires = null;
      const token = generateToken(user._id, '', '');

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        restaurant: null,
      });
    }
  } catch (error) {
    console.error('Verify Admin 2FA Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    await connectDB();
    if (getIsConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
      return res.json({ user, restaurant });
    } else {
      const user = mockStore.users.find((u) => u && String(u._id) === String(req.user._id)) || req.user;
      const restaurant =
        mockStore.restaurants.find((r) => r && String(r.ownerId) === String(req.user._id)) || req.restaurant;
      return res.json({ user, restaurant });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    await connectDB();

    if (getIsConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({ message: 'No registered user account found with this email address.' });
      }

      // Generate a 6-digit OTP code & token
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetPasswordToken = resetCode;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const frontendUrl = process.env.FRONTEND_URL || process.env.VITE_SITE_URL || 'https://www.flashmenu.in';
      const resetUrl = `${frontendUrl}/reset-password?token=${resetCode}&email=${encodeURIComponent(normalizedEmail)}`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0F17; color: #FFFFFF; padding: 30px; border-radius: 16px; border: 1px solid #1F2937;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #F59E0B; margin: 0; font-size: 28px;">FlashMenu</h1>
            <p style="color: #9CA3AF; font-size: 14px; margin-top: 4px;">Smart Digital Menu Platform</p>
          </div>
          
          <h2 style="color: #FFFFFF; font-size: 20px; font-weight: bold;">Password Reset Request</h2>
          <p style="color: #D1D5DB; font-size: 14px; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #D1D5DB; font-size: 14px; line-height: 1.6;">We received a request to reset the password for your FlashMenu account.</p>
          
          <div style="text-align: center; margin: 28px 0;">
            <p style="color: #9CA3AF; font-size: 12px; margin-bottom: 8px; font-weight: bold; text-transform: uppercase;">Your 6-Digit Security Code</p>
            <div style="background-color: #111827; border: 2px solid #F59E0B; display: inline-block; padding: 14px 28px; font-size: 32px; font-weight: 900; color: #F59E0B; letter-spacing: 6px; border-radius: 12px;">
              ${resetCode}
            </div>
          </div>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}" style="background-color: #F59E0B; color: #000000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block;">
              Reset Password Directly &rarr;
            </a>
          </div>

          <p style="color: #6B7280; font-size: 12px; text-align: center; margin-top: 24px; border-top: 1px solid #1F2937; padding-top: 16px;">
            This security code and reset link will expire in 1 hour.<br/>If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `;

      const mailRes = await sendEmail({
        to: user.email,
        subject: 'FlashMenu - Password Reset Security Code',
        html,
      });

      if (mailRes && mailRes.success === false) {
        return res.status(500).json({
          message: mailRes.error || 'Failed to send password reset email via SMTP. Please try again.',
        });
      }

      return res.json({
        message: 'Password reset code has been sent to your email address!',
      });
    } else {
      // Mock store fallback
      const user = mockStore.users.find((u) => u && String(u.email).toLowerCase().trim() === normalizedEmail);
      if (user) {
        const resetCode = '123456';
        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = Date.now() + 3600000;
        return res.json({ message: 'Reset code sent to your email address!' });
      }
      return res.status(404).json({ message: 'No registered user account found with this email address.' });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Please provide security code and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const normalizedToken = String(token).trim();
    await connectDB();

    if (getIsConnected()) {
      let user;
      if (email) {
        const normalizedEmail = String(email).toLowerCase().trim();
        user = await User.findOne({
          email: normalizedEmail,
          resetPasswordToken: normalizedToken,
          resetPasswordExpires: { $gt: Date.now() },
        });
      } else {
        user = await User.findOne({
          resetPasswordToken: normalizedToken,
          resetPasswordExpires: { $gt: Date.now() },
        });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired password reset code/link.' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.json({ message: 'Password updated successfully! You can now log in with your new password.' });
    } else {
      // Mock store fallback
      const user = mockStore.users.find(
        (u) => u && String(u.resetPasswordToken) === normalizedToken
      );
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired password reset code.' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      return res.json({ message: 'Password updated successfully! You can now log in.' });
    }
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, forgotPassword, resetPassword, verifyAdmin2FA };
