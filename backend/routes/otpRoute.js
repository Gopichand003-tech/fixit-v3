import express from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Temporary in-memory store for OTPs with expiration
const otpStore = {};

// Helper: format phone number to E.164
const formatPhone = (phone, countryCode = "+91") => {
  if (phone.startsWith("+")) return phone;
  return countryCode + phone.replace(/\D/g, ""); // remove non-digits
};

// Send OTP
router.post('/send-otp', async (req, res) => {
  let { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone number is required' });

  phone = formatPhone(phone); // ensure E.164 format

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // expires in 5 minutes

  try {
    console.log(`Generated OTP for ${phone}: ${otp}`); // For testing

    await client.messages.create({
      body: `Your FIX-IT OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Twilio error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP. Check phone number and Twilio credentials.' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  let { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });

  phone = formatPhone(phone);

  const record = otpStore[phone];
  if (!record) return res.status(400).json({ message: 'No OTP sent to this number or OTP expired' });

  if (record.expires < Date.now()) {
    delete otpStore[phone];
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }

  if (record.otp.toString() !== otp.toString()) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  delete otpStore[phone]; // single-use OTP
  return res.json({ message: 'OTP verified successfully' });
});

export default router;
