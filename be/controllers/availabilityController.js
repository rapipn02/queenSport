const db = require('../config/database');

// Check time slot availability for a specific date and facility
exports.checkAvailability = async (req, res) => {
  try {
    const { id_lapangan, tanggal } = req.query;

    if (!id_lapangan || !tanggal) {
      return res.status(400).json({
        success: false,
        message: 'id_lapangan dan tanggal harus diisi'
      });
    }

    // Get all booked time slots for this facility and date
    // Include both "Dibooking" (paid) and "Reserved" (pending payment)
    const [bookedSlots] = await db.query(`
      SELECT jam_mulai, jam_selesai, status 
      FROM jadwal 
      WHERE id_lapangan = ? 
      AND tanggal = ? 
      AND status IN ('Dibooking', 'Reserved')
    `, [id_lapangan, tanggal]);

    // Generate all possible time slots (07:00 - 19:00)
    const allTimeSlots = [];
    for (let hour = 7; hour < 20; hour++) {
      allTimeSlots.push(`${String(hour).padStart(2, '0')}.00`);
    }

    // Mark which slots are booked or pending
    const availability = allTimeSlots.map(slot => {
      const slotHour = parseInt(slot.split('.')[0]);
      const slotTime = `${String(slotHour).padStart(2, '0')}:00:00`;
      const slotEndTime = `${String(slotHour + 1).padStart(2, '0')}:00:00`;

      // Check if this slot overlaps with any booked/pending slot
      let slotStatus = 'available';
      
      for (const booked of bookedSlots) {
        const overlaps = (slotTime >= booked.jam_mulai && slotTime < booked.jam_selesai) ||
                        (slotEndTime > booked.jam_mulai && slotEndTime <= booked.jam_selesai) ||
                        (slotTime <= booked.jam_mulai && slotEndTime >= booked.jam_selesai);
        
        if (overlaps) {
          // "Dibooking" = paid/confirmed (red), "Reserved" = pending payment (green)
          slotStatus = booked.status === 'Dibooking' ? 'booked' : 'pending';
          break;
        }
      }

      return {
        time: slot,
        status: slotStatus
      };
    });

    res.json({
      success: true,
      data: {
        id_lapangan: parseInt(id_lapangan),
        tanggal,
        slots: availability
      }
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengecek ketersediaan'
    });
  }
};

module.exports = exports;
