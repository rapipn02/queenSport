const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Midtrans notification webhook
router.post('/midtrans/notification', paymentController.midtransNotification);

// Check payment status
router.get('/status/:order_id', paymentController.checkPaymentStatus);

// Get all payments (admin)
router.get('/', paymentController.getAllPayments);

// Get payment by booking ID
router.get('/booking/:booking_id', paymentController.getPaymentByBookingId);

module.exports = router;
