const express = require('express');
const router = express.Router();

const historyController = require('./history.controller');

// Route untuk mendapatkan laporan berdasarkan user yang sedang login
router.route('/user').get(historyController.getUserReports);

// Route untuk mendapatkan semua laporan (khusus admin)
router.route('/all').get(historyController.getAllReports);

// Route untuk mendapatkan detail laporan berdasarkan ID
router.route('/:id').get(historyController.getReportByID);

module.exports = router;
