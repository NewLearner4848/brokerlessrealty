const AdminModel = require('../models/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SettingsModel = require('../models/settings.model');
const { sendResetOTPEmail } = require('../services/email.service');

// Simple in-memory OTP store
const otpStore = new Map();

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    const admin = await AdminModel.findByUsername(username);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide email address' });
  }

  try {
    // Get the configured receiver_email from settings
    const dbSettings = await SettingsModel.getSettings();
    const receiverEmail = dbSettings.receiver_email || process.env.RECEIVER_EMAIL || 'piyushkhardekar.in@gmail.com';

    // Verify email matches the admin's email
    if (email.toLowerCase().trim() !== receiverEmail.toLowerCase().trim()) {
      return res.status(400).json({ message: 'Email address does not match admin email' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Store in-memory
    otpStore.set(email.toLowerCase().trim(), { otp, expiresAt });

    // Print to console (CRITICAL for local testing without smtp)
    console.log('\n=======================================');
    console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
    console.log(`OTP CODE: ${otp}`);
    console.log('=======================================\n');

    // Attempt to send email
    const emailSent = await sendResetOTPEmail(email, otp);

    if (emailSent) {
      return res.json({ message: 'OTP sent to your email.' });
    } else {
      // If email configuration is missing or failing, we still allow reset via console log in development
      return res.json({ 
        message: 'OTP generated. (Please check server console/logs for code if email is not configured)',
        isMocked: true 
      });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error during forgot password process' });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP is valid!
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password in DB for 'admin'
    await AdminModel.updatePassword('admin', passwordHash);

    // Clear OTP
    otpStore.delete(normalizedEmail);

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

module.exports = { loginAdmin, forgotPassword, resetPassword };

