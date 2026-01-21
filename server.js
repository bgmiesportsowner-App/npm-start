const express = require('express');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Render port detection
const PORT = process.env.PORT || 5003;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  // Timeout fix for Render
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

const otpStore = new Map();

app.get('/', (req, res) => res.json({ status: '✅ BGMI Real OTP Live!' }));

app.post('/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  console.log(`📧 Real OTP ${otp} → ${email}`);
  otpStore.set(email, otp);
  
  // Test email - same as yours
  const testEmail = 'akash63992006@gmail.com';
  
  try {
    await transporter.sendMail({
      from: `"BGMI Esports" <${process.env.GMAIL_USER}>`,
      to: testEmail, // Test with your email first
      subject: '🎮 BGMI - Your OTP',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00d4aa;">BGMI Esports Platform</h2>
          <div style="background: linear-gradient(45deg, #00d4aa, #00b894); 
                      color: white; padding: 30px; font-size: 48px; 
                      text-align: center; border-radius: 15px; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="font-size: 16px; margin: 20px 0; color: #666;">
            Your OTP for BGMI Tournament Registration<br>
            Valid for 5 minutes only
          </p>
        </div>
      `
    });
    
    console.log(`✅ REAL OTP SENT to ${testEmail}: ${otp}`);
    res.json({ success: true, message: 'OTP sent to your email!' });
  } catch (error) {
    console.error('❌ EMAIL ERROR:', error.message);
    res.status(500).json({ success: false, error: 'Email service temporarily unavailable' });
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

// Render port fix
app.listen(PORT, () => {
  console.log(`✅ BGMI Real OTP: http://localhost:${PORT}`);
  console.log(`🌐 Render URL: https://npm-start-7vdr.onrender.com`);
});
