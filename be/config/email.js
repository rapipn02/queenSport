require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('=== EMAIL CONFIG ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ SET' : '❌ NOT SET');
console.log('===================\n');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email connection failed:', error.message);
    console.log('\n💡 Solutions:');
    console.log('   1. Connect to mobile hotspot');
    console.log('   2. Disable firewall/antivirus');
    console.log('   3. Check if App Password is correct');
  } else {
    console.log('✓ Email server ready to send messages');
  }
});

module.exports = transporter;