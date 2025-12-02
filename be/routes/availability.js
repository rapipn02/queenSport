const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// Check availability for specific date and facility
router.get('/check', availabilityController.checkAvailability);

module.exports = router;
