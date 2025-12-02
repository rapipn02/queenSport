require('dotenv').config({ path: __dirname + '/../.env' });
const nodemailer = require('nodemailer');

console.log('=== EMAIL CONFIG (OAuth2) ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('CLIENT_ID:', process.env.GMAIL_CLIENT_ID ? '✓ SET' : '❌ NOT SET');
console.log('CLIENT_SECRET:', process.env.GMAIL_CLIENT_SECRET ? '✓ SET' : '❌ NOT SET');
console.log('REFRESH_TOKEN:', process.env.GMAIL_REFRESH_TOKEN ? '✓ SET' : '❌ NOT SET');
console.log('=============================\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN
  }
});

module.exports = transporter;