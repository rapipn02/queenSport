const db = require('../config/database');

class Lapangan {
  // Get all lapangan
  static async getAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM lapangan ORDER BY id_lapangan DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get lapangan by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM lapangan WHERE id_lapangan = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new lapangan
  static async create(data) {
    try {
      const { nama_lapangan, jenis, harga, status } = data;
      const [result] = await db.query(
        'INSERT INTO lapangan (nama_lapangan, jenis, harga, status) VALUES (?, ?, ?, ?)',
        [nama_lapangan, jenis, harga, status || 'Tersedia']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update lapangan
  static async update(id, data) {
    try {
      const { nama_lapangan, jenis, harga, status } = data;
      const [result] = await db.query(
        'UPDATE lapangan SET nama_lapangan = ?, jenis = ?, harga = ?, status = ? WHERE id_lapangan = ?',
        [nama_lapangan, jenis, harga, status, id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Delete lapangan
  static async delete(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM lapangan WHERE id_lapangan = ?',
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Get lapangan by status
  static async getByStatus(status) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM lapangan WHERE status = ?',
        [status]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Count lapangan by status
  static async countByStatus() {
    try {
      const [rows] = await db.query(
        `SELECT 
          SUM(CASE WHEN status = 'Tersedia' THEN 1 ELSE 0 END) as aktif,
          SUM(CASE WHEN status = 'Tidak Tersedia' THEN 1 ELSE 0 END) as tidak_aktif,
          COUNT(*) as total
        FROM lapangan`
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Lapangan;
