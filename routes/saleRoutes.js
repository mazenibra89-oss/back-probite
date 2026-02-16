const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// Route untuk Customer Checkout
router.post('/', saleController.createSale);

// Route untuk Admin melihat riwayat
router.get('/history', saleController.getSalesHistory);

// Route untuk Admin mengubah status pembayaran (Tombol "Sudah Dibayar")
router.put('/:id/status', saleController.updateSaleStatus);

module.exports = router;