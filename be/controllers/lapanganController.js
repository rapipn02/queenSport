const Lapangan = require('../models/Lapangan');

// Get all lapangan
exports.getAllLapangan = async (req, res) => {
  try {
    const lapangan = await Lapangan.getAll();
    res.json({
      success: true,
      data: lapangan
    });
  } catch (error) {
    console.error('Error getting lapangan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data lapangan'
    });
  }
};

// Get lapangan by ID
exports.getLapanganById = async (req, res) => {
  try {
    const { id } = req.params;
    const lapangan = await Lapangan.getById(id);
    
    if (!lapangan) {
      return res.status(404).json({
        success: false,
        message: 'Lapangan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: lapangan
    });
  } catch (error) {
    console.error('Error getting lapangan by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data lapangan'
    });
  }
};

// Create new lapangan
exports.createLapangan = async (req, res) => {
  try {
    const { nama_lapangan, jenis, harga, status } = req.body;

    // Validation
    if (!nama_lapangan || !jenis || !harga) {
      return res.status(400).json({
        success: false,
        message: 'Nama lapangan, jenis, dan harga harus diisi'
      });
    }

    // Set default harga based on jenis if not provided
    let finalHarga = harga;
    if (!harga) {
      if (jenis.toLowerCase() === 'futsal') {
        finalHarga = 100000;
      } else if (jenis.toLowerCase() === 'badminton') {
        finalHarga = 40000;
      }
    }

    const insertId = await Lapangan.create({
      nama_lapangan,
      jenis,
      harga: finalHarga,
      status: status || 'Tersedia'
    });

    const newLapangan = await Lapangan.getById(insertId);

    res.status(201).json({
      success: true,
      message: 'Lapangan berhasil ditambahkan',
      data: newLapangan
    });
  } catch (error) {
    console.error('Error creating lapangan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan lapangan'
    });
  }
};

// Update lapangan
exports.updateLapangan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_lapangan, jenis, harga, status } = req.body;

    // Check if lapangan exists
    const existingLapangan = await Lapangan.getById(id);
    if (!existingLapangan) {
      return res.status(404).json({
        success: false,
        message: 'Lapangan tidak ditemukan'
      });
    }

    // Validation
    if (!nama_lapangan || !jenis || !harga) {
      return res.status(400).json({
        success: false,
        message: 'Nama lapangan, jenis, dan harga harus diisi'
      });
    }

    const affectedRows = await Lapangan.update(id, {
      nama_lapangan,
      jenis,
      harga,
      status: status || existingLapangan.status
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gagal mengupdate lapangan'
      });
    }

    const updatedLapangan = await Lapangan.getById(id);

    res.json({
      success: true,
      message: 'Lapangan berhasil diupdate',
      data: updatedLapangan
    });
  } catch (error) {
    console.error('Error updating lapangan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate lapangan'
    });
  }
};

// Delete lapangan
exports.deleteLapangan = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if lapangan exists
    const existingLapangan = await Lapangan.getById(id);
    if (!existingLapangan) {
      return res.status(404).json({
        success: false,
        message: 'Lapangan tidak ditemukan'
      });
    }

    const affectedRows = await Lapangan.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gagal menghapus lapangan'
      });
    }

    res.json({
      success: true,
      message: 'Lapangan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting lapangan:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus lapangan'
    });
  }
};

// Get lapangan statistics
exports.getLapanganStats = async (req, res) => {
  try {
    const stats = await Lapangan.countByStatus();
    res.json({
      success: true,
      data: {
        lapangan_aktif: stats.aktif || 0,
        lapangan_tidak_aktif: stats.tidak_aktif || 0,
        total_lapangan: stats.total || 0
      }
    });
  } catch (error) {
    console.error('Error getting lapangan stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik lapangan'
    });
  }
};
