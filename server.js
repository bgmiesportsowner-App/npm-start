const express = require('express');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const otpStore = new Map();

app.get('/', (req, res) => res.json({ status: '✅ BGMI Real OTP Live!' }));

app.post('/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  console.log(`📧 Real OTP ${otp} → ${email}`);
  otpStore.set(email, otp);
  
  try {
    await transporter.sendMail({
      from: `"BGMI Esports" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🎮 BGMI - Your OTP',
      html: `<h1 style="color:#00d4aa;font-size:48px">${otp}</h1>`
    });
    
    console.log(`✅ REAL OTP SENT: ${otp}`);
    res.json({ success: true, message: 'OTP sent to your email!' });
  } catch (error) {
    console.error('❌ EMAIL ERROR:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
});

app.post('/auth/verify-otp', (req, res) => {
  const { name, email, password, code } = req.body;
  const storedOtp = otpStore.get(email);
  
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

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`✅ BGMI Real OTP: http://localhost:${PORT}`);
});
