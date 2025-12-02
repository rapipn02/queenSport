const db = require('../config/database');

class Jadwal {
  // Create jadwal for booking
  static async create(data) {
    try {
      const { id_lapangan, tanggal, jam_mulai, jam_selesai, status } = data;
      const [result] = await db.query(
        'INSERT INTO jadwal (id_lapangan, tanggal, jam_mulai, jam_selesai, status) VALUES (?, ?, ?, ?, ?)',
        [id_lapangan, tanggal, jam_mulai, jam_selesai, status || 'Tersedia']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get jadwal by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT j.*, l.nama_lapangan, l.jenis, l.harga 
         FROM jadwal j
         LEFT JOIN lapangan l ON j.id_lapangan = l.id_lapangan
         WHERE j.id_jadwal = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check availability
  static async checkAvailability(id_lapangan, tanggal, jam_mulai, jam_selesai) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM jadwal 
         WHERE id_lapangan = ? 
         AND tanggal = ? 
         AND status = 'Dibooking'
         AND (
           (jam_mulai < ? AND jam_selesai > ?) OR
           (jam_mulai < ? AND jam_selesai > ?) OR
           (jam_mulai >= ? AND jam_selesai <= ?)
         )`,
        [id_lapangan, tanggal, jam_selesai, jam_mulai, jam_selesai, jam_mulai, jam_mulai, jam_selesai]
      );
      return rows.length === 0; // true jika available
    } catch (error) {
      throw error;
    }
  }

  // Update status
  static async updateStatus(id, status) {
    try {
      const [result] = await db.query(
        'UPDATE jadwal SET status = ? WHERE id_jadwal = ?',
        [status, id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get jadwal by lapangan and date
  static async getByLapanganAndDate(id_lapangan, tanggal) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM jadwal WHERE id_lapangan = ? AND tanggal = ?',
        [id_lapangan, tanggal]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Jadwal;
