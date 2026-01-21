const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;
const otpStore = new Map();

// 🧪 TEST ROUTES - 100% WORKING
app.get('/', (req, res) => res.json({ status: '✅ BGMI Real OTP Live!' }));

app.post('/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = 123456; // 🧪 FIXED OTP FOR TESTING
  
  otpStore.set(email, otp);
  console.log(`🧪 INSTANT OTP ${otp} → ${email}`);
  
  res.json({ 
    success: true, 
    message: `🧪 TEST MODE: Your OTP is ${otp}`,
    testOtp: otp 
  });
});

app.post('/auth/verify-otp', (req, res) => {
  const { name, email, password, code } = req.body;
  const storedOtp = otpStore.get(email);
  
  console.log(`🔍 Verify: ${code} vs ${storedOtp}`);
  
  if (parseInt(code) !== storedOtp) {
    return res.status(400).json({ success: false, error: 'Invalid OTP!' });
  }
  
  otpStore.delete(email);
  console.log(`✅ REGISTERED: ${name}`);
  
  res.json({
    success: true,
    user: { id: Date.now().toString(), name, email },
    token: 'bgmi-token-' + Date.now()
  });
});

app.post('/auth/login', (req, res) => {
  res.json({ success: true, user: { id: '1', name: 'Player' }, token: 'login-token' });
});

app.listen(PORT, () => {
  console.log(`✅ BGMI TEST MODE: http://localhost:${PORT}`);
  console.log(`🧪 OTP = 123456 (No Gmail needed!)`);
});
