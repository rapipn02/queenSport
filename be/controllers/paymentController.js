const Pembayaran = require('../models/Pembayaran');
const Booking = require('../models/Booking');
const { core } = require('../config/midtrans');
const {sendInvoiceEmail} = require('../services/emailService');
const db = require('../config/database');
// Midtrans notification handler
exports.midtransNotification = async (req, res) => {
  try {
    const notification = req.body;
    
    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type
    } = notification;

    console.log('Midtrans Notification:', notification);

    // Get pembayaran by order_id
    const pembayaran = await Pembayaran.getByOrderId(order_id);
    
    if (!pembayaran) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    let bookingStatus = 'Menunggu';
    let transactionStatus = transaction_status;

    // Handle different transaction status
    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        transactionStatus = 'settlement';
        bookingStatus = 'Dikonfirmasi';
      }
    } else if (transaction_status === 'settlement') {
      transactionStatus = 'settlement';
      bookingStatus = 'Dikonfirmasi';

       await sendBookingInvoiceEmail(pembayaran.id_booking);


    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      transactionStatus = 'failed';
      bookingStatus = 'Dibatalkan';
    } else if (transaction_status === 'pending') {
      transactionStatus = 'pending';
      bookingStatus = 'Menunggu';
    }

    // Update pembayaran status
    await Pembayaran.updateTransactionStatus(order_id, transactionStatus, payment_type);

    // Update booking status
    await Booking.updateStatus(pembayaran.id_booking, bookingStatus);

    res.json({
      success: true,
      message: 'Notification processed'
    });

  } catch (error) {
    console.error('Error processing notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing notification'
    });
  }
};

const sendBookingInvoiceEmail = async (bookingId) => {
  try {
    // Get full booking data with payment details
    const [bookingData] = await db.query(`
      SELECT 
        b.id_booking,
        b.nama,
        b.email,
        b.no_telepon,
        b.tanggal,
        b.total_harga,
        l.nama_lapangan,
        l.jenis,
        j.jam_mulai,
        j.jam_selesai,
        p.jumlah_bayar as harga_dp,
        p.metode as metode_pembayaran
      FROM booking b
      LEFT JOIN lapangan l ON b.id_lapangan = l.id_lapangan
      LEFT JOIN jadwal j ON j.id_booking = b.id_booking
      LEFT JOIN pembayaran p ON b.id_booking = p.id_booking
      WHERE b.id_booking = ?
      LIMIT 1
    `, [bookingId]);

    if (bookingData.length > 0) {
      const emailResult = await sendInvoiceEmail(bookingData[0]);
      if (emailResult.success) {
        console.log(`✓ Invoice email sent to ${bookingData[0].email}`);
      } else {
        console.error(`✗ Failed to send invoice email: ${emailResult.error}`);
      }
    }
  } catch (error) {
    console.error('Error sending booking invoice email:', error);
  }
};

// Check payment status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Get transaction status from Midtrans
    const statusResponse = await core.transaction.status(order_id);

    // Get pembayaran data
    const pembayaran = await Pembayaran.getByOrderId(order_id);

    if (!pembayaran) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: {
        order_id,
        transaction_status: statusResponse.transaction_status,
        fraud_status: statusResponse.fraud_status,
        payment_type: statusResponse.payment_type,
        pembayaran
      }
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengecek status pembayaran',
      error: error.message
    });
  }
};

// Get all payments (for admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Pembayaran.getAll();
    
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pembayaran'
    });
  }
};

// Get payment by booking ID
exports.getPaymentByBookingId = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const payment = await Pembayaran.getByBookingId(booking_id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pembayaran'
    });
  }
};

