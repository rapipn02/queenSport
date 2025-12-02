const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const lapanganRoutes = require('./routes/lapangan');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const availabilityRoutes = require('./routes/availability');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lapangan', lapanganRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/availability', availabilityRoutes);

// Auto-cancel expired bookings every 5 minutes
const bookingController = require('./controllers/bookingController');
setInterval(async () => {
  try {
    console.log('Running auto-cancel expired bookings...');
    await bookingController.cancelExpiredBookings({}, {
      json: (data) => console.log('Auto-cancel result:', data)
    });
  } catch (error) {
    console.error('Error in auto-cancel:', error);
  }
}, 5 * 60 * 1000); // 5 minutes

// Health check - PASTIKAN ADA (req, res)
app.get('/', (req, res) => {  // ✅ Harus ada req dan res
  res.json({ 
    success: true,
    message: 'QueenSportHall API is running',
    version: '1.0.0'
  });
});

// Error handling - PASTIKAN ADA (err, req, res, next)
app.use((err, req, res, next) => {  // ✅ Harus ada semua parameter
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Terjadi kesalahan server' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` sedang jalan di port http://localhost:${PORT}`);
});