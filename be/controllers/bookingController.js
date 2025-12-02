const Booking = require('../models/Booking');
const Jadwal = require('../models/Jadwal');
const Pembayaran = require('../models/Pembayaran');
const Lapangan = require('../models/Lapangan');
const { snap } = require('../config/midtrans');

// Create booking with jadwal
exports.createBooking = async (req, res) => {
  try {
    const { 
      id_lapangan, 
      nama, 
      no_telepon, 
      email,
      tanggal, 
      jam_slots, // array of time slots ['09.00', '10.00', '11.00']
      metode_pembayaran // 'DP' or 'Lunas'
    } = req.body;

    // Validation
    if (!id_lapangan || !nama || !no_telepon || !tanggal || !jam_slots || jam_slots.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak lengkap'
      });
    }

    // Get lapangan info
    const lapangan = await Lapangan.getById(id_lapangan);
    if (!lapangan) {
      return res.status(404).json({
        success: false,
        message: 'Lapangan tidak ditemukan'
      });
    }

    // Sort jam slots and convert to TIME format (HH:MM:SS)
    const sortedSlots = jam_slots.sort();
    const firstTime = sortedSlots[0].replace('.', ':') + ':00'; // "09.00" -> "09:00:00"
    const lastSlot = sortedSlots[sortedSlots.length - 1];
    const lastHour = parseInt(lastSlot.split('.')[0]);
    const lastTime = `${String(lastHour + 1).padStart(2, '0')}:00:00`;
    
    const jam_mulai = firstTime;
    const jam_selesai = lastTime;
    
    // Check availability
    const isAvailable = await Jadwal.checkAvailability(id_lapangan, tanggal, jam_mulai, jam_selesai);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Jadwal sudah dibooking'
      });
    }

    // Calculate total harga
    const durasi_jam = jam_slots.length;
    const total_harga = durasi_jam * parseFloat(lapangan.harga);
    const jumlah_bayar = metode_pembayaran === 'DP' ? total_harga * 0.5 : total_harga;

    // Create jadwal with status "Reserved" (temporary hold for 15 minutes)
    const id_jadwal = await Jadwal.create({
      id_lapangan,
      tanggal,
      jam_mulai,
      jam_selesai,
      status: 'Reserved' // Temporary status, will be "Dibooking" after payment
    });

    // Create booking with status "Pending" (waiting for payment)
    const id_booking = await Booking.create({
      id_jadwal,
      nama,
      no_telepon,
      email: email || null,
      tanggal_booking: tanggal,
      durasi_jam,
      total_harga,
      status: 'Pending' // Will be "Dikonfirmasi" after payment
    });

    // Create order_id for Midtrans
    const order_id = `BOOKING-${id_booking}-${Date.now()}`;
    
    // Set expiry time (15 minutes from now)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15);

    // Create pembayaran record
    await Pembayaran.create({
      id_booking,
      tanggal_bayar: new Date().toISOString().split('T')[0],
      jumlah_bayar,
      metode: metode_pembayaran,
      order_id,
      transaction_status: 'pending',
      expiry_time: expiryTime
    });

    // Create Midtrans transaction
    // Important: gross_amount must equal sum of item_details
    // For DP, we create single item with DP price, not full price
    const pricePerItem = metode_pembayaran === 'DP' 
      ? Math.round(parseFloat(lapangan.harga) * 0.5) // DP = 50% per jam
      : parseFloat(lapangan.harga);

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: jumlah_bayar
      },
      customer_details: {
        first_name: nama,
        email: email || `${no_telepon}@noemail.com`,
        phone: no_telepon
      },
      item_details: [{
        id: id_lapangan,
        price: pricePerItem,
        quantity: durasi_jam,
        name: `${lapangan.nama_lapangan} - ${tanggal} (${metode_pembayaran})`
      }],
      enabled_payments: ['qris', 'gopay', 'shopeepay', 'bca_va', 'bni_va', 'bri_va', 'permata_va', 'other_va', 'credit_card'],
      callbacks: {
        finish: 'http://localhost:3000/payment-success'
      }
    };

    console.log('Creating Midtrans transaction with params:', JSON.stringify(parameter, null, 2));
    const transaction = await snap.createTransaction(parameter);
    console.log('Midtrans transaction created:', transaction);

    res.status(201).json({
      success: true,
      message: 'Booking berhasil dibuat',
      data: {
        id_booking,
        order_id,
        snap_token: transaction.token,
        snap_redirect_url: transaction.redirect_url,
        total_harga,
        jumlah_bayar,
        durasi_jam
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat booking',
      error: error.message
    });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data booking'
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.getById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    // Get pembayaran info
    const pembayaran = await Pembayaran.getByBookingId(id);

    res.json({
      success: true,
      data: {
        ...booking,
        pembayaran
      }
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data booking'
    });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, no_telepon, email, status } = req.body;

    const booking = await Booking.getById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    await Booking.update(id, { nama, no_telepon, email, status });

    // If status changed to 'Dibatalkan', update jadwal status
    if (status === 'Dibatalkan') {
      await Jadwal.updateStatus(booking.id_jadwal, 'Tersedia');
    }

    const updatedBooking = await Booking.getById(id);

    res.json({
      success: true,
      message: 'Booking berhasil diupdate',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate booking'
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.getById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    // Update jadwal to available
    await Jadwal.updateStatus(booking.id_jadwal, 'Tersedia');
    
    // Delete booking
    await Booking.delete(id);

    res.json({
      success: true,
      message: 'Booking berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus booking'
    });
  }
};

// Auto-cancel expired bookings (run periodically)
exports.cancelExpiredBookings = async (req, res) => {
  try {
    const db = require('../config/database');
    const now = new Date();

    // Find expired pending bookings
    const [expiredBookings] = await db.query(`
      SELECT b.id_booking, b.id_jadwal, p.expiry_time 
      FROM booking b
      JOIN pembayaran p ON b.id_booking = p.id_booking
      WHERE b.status = 'Pending' 
      AND p.transaction_status = 'pending'
      AND p.expiry_time < ?
    `, [now]);

    console.log(`Found ${expiredBookings.length} expired bookings`);

    for (const booking of expiredBookings) {
      // Update booking status to "Dibatalkan"
      await db.query('UPDATE booking SET status = ? WHERE id_booking = ?', ['Dibatalkan', booking.id_booking]);
      
      // Update jadwal status to "Tersedia"
      await db.query('UPDATE jadwal SET status = ? WHERE id_jadwal = ?', ['Tersedia', booking.id_jadwal]);
      
      // Update payment status to "expire"
      await db.query('UPDATE pembayaran SET transaction_status = ? WHERE id_booking = ?', ['expire', booking.id_booking]);
      
      console.log(`Cancelled booking #${booking.id_booking}`);
    }

    res.json({
      success: true,
      message: `${expiredBookings.length} booking(s) cancelled`,
      cancelled: expiredBookings.length
    });
  } catch (error) {
    console.error('Error cancelling expired bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membatalkan booking kadaluarsa'
    });
  }
};

// Update payment status (called by Midtrans webhook or after payment)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;

    const db = require('../config/database');
    
    // Get booking by order_id
    const [payments] = await db.query('SELECT * FROM pembayaran WHERE order_id = ?', [order_id]);
    
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = payments[0];
    const id_booking = payment.id_booking;

    // Update payment status
    await db.query('UPDATE pembayaran SET transaction_status = ? WHERE order_id = ?', [transaction_status, order_id]);

    // If payment success, update booking and jadwal status
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      // Get booking to find jadwal
      const [bookings] = await db.query('SELECT * FROM booking WHERE id_booking = ?', [id_booking]);
      const booking = bookings[0];

      // Update booking status to "Dikonfirmasi"
      await db.query('UPDATE booking SET status = ? WHERE id_booking = ?', ['Dikonfirmasi', id_booking]);
      
      // Update jadwal status to "Dibooking"
      await db.query('UPDATE jadwal SET status = ? WHERE id_jadwal = ?', ['Dibooking', booking.id_jadwal]);
      
      console.log(`Payment success for booking #${id_booking}`);
    }

    res.json({
      success: true,
      message: 'Payment status updated',
      transaction_status
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update status pembayaran'
    });
  }
};

// Get bookings by user
exports.getBookingsByUser = async (req, res) => {
  try {
    const { identifier } = req.params; // email or phone
    const bookings = await Booking.getByUser(identifier);
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data booking'
    });
  }
};
