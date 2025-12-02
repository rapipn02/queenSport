const express = require('express');
const router = express.Router();
const lapanganController = require('../controllers/lapanganController');
// const { verifyToken } = require('../middleware/auth'); // Uncomment jika sudah ada auth

// Get all lapangan
router.get('/', lapanganController.getAllLapangan);

// Get lapangan statistics
router.get('/stats', lapanganController.getLapanganStats);

// Get lapangan by ID
router.get('/:id', lapanganController.getLapanganById);

// Create new lapangan (admin only)
// router.post('/', verifyToken, lapanganController.createLapangan); // With auth
router.post('/', lapanganController.createLapangan); // Without auth for now

// Update lapangan (admin only)
// router.put('/:id', verifyToken, lapanganController.updateLapangan); // With auth
router.put('/:id', lapanganController.updateLapangan); // Without auth for now

// Delete lapangan (admin only)
// router.delete('/:id', verifyToken, lapanganController.deleteLapangan); // With auth
router.delete('/:id', lapanganController.deleteLapangan); // Without auth for now

module.exports = router;
