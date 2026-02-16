const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/', saleController.createSale); // Ini untuk Customer Checkout
router.get('/history', saleController.getSalesHistory); // Ini untuk Admin Panel

module.exports = router;