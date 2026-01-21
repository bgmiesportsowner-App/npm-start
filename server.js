const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;
const otpStore = new Map();

app.get('/', (req, res) => res.json({ status: '✅ BGMI LIVE - OTP=123456' }));

app.post('/auth/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = 123456;
  
  otpStore.set(email, otp);
  console.log(`OTP 123456 → ${email}`);
  
  // 🔥 DIRECT OTP FRONTEND KO BHEJ RAHA
  res.json({ 
    success: true, 
    otp: 123456,
    message: '✅ OTP: 123456 - Use this code!'
  });
});

app.post('/auth/verify-otp', (req, res) => {
  const { name, email, password, code } = req.body;
  
  if (parseInt(code) !== 123456) {
    return res.status(400).json({ success: false, error: 'Wrong OTP!' });
  }
  
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

app.listen(PORT, () => console.log(`✅ BGMI: Port ${PORT} - OTP=123456`));
