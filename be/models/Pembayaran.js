const db = require('../config/database');

class Pembayaran {
  // Create pembayaran
  static async create(data) {
    try {
      const { id_booking, tanggal_bayar, jumlah_bayar, metode, order_id, transaction_status } = data;
      const [result] = await db.query(
        `INSERT INTO pembayaran (id_booking, tanggal_bayar, jumlah_bayar, metode, order_id, transaction_status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_booking, tanggal_bayar, jumlah_bayar, metode, order_id || null, transaction_status || 'pending']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get pembayaran by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT p.*, b.nama, b.no_telepon, b.email, b.total_harga,
                j.tanggal, j.jam_mulai, j.jam_selesai,
                l.nama_lapangan, l.jenis
         FROM pembayaran p
         LEFT JOIN booking b ON p.id_booking = b.id_booking
         LEFT JOIN jadwal j ON b.id_jadwal = j.id_jadwal
         LEFT JOIN lapangan l ON j.id_lapangan = l.id_lapangan
         WHERE p.id_pembayaran = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get pembayaran by booking ID
  static async getByBookingId(id_booking) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM pembayaran WHERE id_booking = ?',
        [id_booking]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get pembayaran by order_id (Midtrans)
  static async getByOrderId(order_id) {
    try {
      const [rows] = await db.query(
        `SELECT p.*, b.nama, b.no_telepon, b.email, b.total_harga,
                j.tanggal, j.jam_mulai, j.jam_selesai,
                l.nama_lapangan, l.jenis
         FROM pembayaran p
         LEFT JOIN booking b ON p.id_booking = b.id_booking
         LEFT JOIN jadwal j ON b.id_jadwal = j.id_jadwal
         LEFT JOIN lapangan l ON j.id_lapangan = l.id_lapangan
         WHERE p.order_id = ?`,
        [order_id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update transaction status
  static async updateTransactionStatus(order_id, transaction_status, metode = null) {
    try {
      let query = 'UPDATE pembayaran SET transaction_status = ?';
      let params = [transaction_status];
      
      if (metode) {
        query += ', metode = ?';
        params.push(metode);
      }
      
      query += ' WHERE order_id = ?';
      params.push(order_id);
      
      const [result] = await db.query(query, params);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get all pembayaran
  static async getAll() {
    try {
      const [rows] = await db.query(
        `SELECT p.*, b.nama, b.no_telepon, b.email, b.total_harga,
                j.tanggal, j.jam_mulai, j.jam_selesai,
                l.nama_lapangan, l.jenis
         FROM pembayaran p
         LEFT JOIN booking b ON p.id_booking = b.id_booking
         LEFT JOIN jadwal j ON b.id_jadwal = j.id_jadwal
         LEFT JOIN lapangan l ON j.id_lapangan = l.id_lapangan
         ORDER BY p.id_pembayaran DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pembayaran;
