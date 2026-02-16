const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// Jalur untuk menyimpan transaksi baru
router.post('/', saleController.createSale);

// Jalur untuk mengambil riwayat transaksi untuk laporan
router.get('/history', saleController.getSalesHistory);

module.exports = router;