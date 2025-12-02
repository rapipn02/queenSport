const db = require('../config/database');

class Booking {
  // Create booking
  static async create(data) {
    try {
      const { id_jadwal, nama, no_telepon, email, tanggal_booking, durasi_jam, total_harga, status } = data;
      const [result] = await db.query(
        `INSERT INTO booking (id_jadwal, nama, no_telepon, email, tanggal_booking, durasi_jam, total_harga, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_jadwal, nama, no_telepon, email, tanggal_booking, durasi_jam, total_harga, status || 'Menunggu']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get booking by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT b.*, j.tanggal, j.jam_mulai, j.jam_selesai, 
                l.nama_lapangan, l.jenis, l.harga,
                p.jumlah_bayar as harga_dp, p.metode as metode_pembayaran
         FROM booking b
         LEFT JOIN jadwal j ON b.id_jadwal = j.id_jadwal
         LEFT JOIN lapangan l ON j.id_lapangan = l.id_lapangan
         LEFT JOIN pembayaran p ON b.id_booking = p.id_booking
         WHERE b.id_booking = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all bookings
  static async getAll() {
    try {
      const [rows] = await db.query(
        `SELECT b.*, j.tanggal, j.jam_mulai, j.jam_selesai, 
                l.nama_lapangan, l.jenis, l.harga,
                p.jumlah_bayar as harga_dp, p.metode as metode_pembayaran
         FROM booking b
         LEFT JOIN jadwal j ON b.id_jadwal = j.id_jadwal
         LEFT JOIN lapangan l ON j.id_lapangan = l.id_lapangan
         LEFT JOIN pembayaran p ON b.id_booking = p.id_booking
         ORDER BY b.created_at DESC, b.id_booking DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update booking status
  static async updateStatus(id, status) {
    try {
      const [result] = await db.query(
        'UPDATE booking SET status = ? WHERE id_booking = ?',
        [status, id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Update booking
  static async update(id, data) {
    try {
      const { nama, no_telepon, email, status } = data;
      const [result] = await db.query(
        'UPDATE booking SET nama = ?, no_telepon = ?, email = ?, status = ? WHERE id_booking = ?',
        [nama, no_telepon, email, status, id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Delete booking
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM booking WHERE id_booking = ?',
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get bookings by user (email or phone)
  static async getByUser(identifier) {
    try {
      const [rows] = await db.query(
        `SELECT b.*, j.tanggal, j.jam_mulai, j.jam_selesai, 
                l.nama_lapangan, l.jenis, l.harga,
                p.jumlah_bayar as harga_dp, p.metode as metode_pembayaran
         FROM booking b
         LEFT JOIN jadwal j ON b.id_jadwal = j.id_jadwal
         LEFT JOIN lapangan l ON j.id_lapangan = l.id_lapangan
         LEFT JOIN pembayaran p ON b.id_booking = p.id_booking
         WHERE b.email = ? OR b.no_telepon = ?
         ORDER BY b.created_at DESC, b.id_booking DESC`,
        [identifier, identifier]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Booking;
