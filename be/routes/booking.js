const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Get bookings by user (email or phone)
router.get('/user/:identifier', bookingController.getBookingsByUser);

// Cancel expired bookings
router.post('/cancel-expired', bookingController.cancelExpiredBookings);

// Update payment status
router.post('/update-payment', bookingController.updatePaymentStatus);

// Update booking
router.put('/:id', bookingController.updateBooking);

// Delete booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
