const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Endpoint: /api/expenses

// Menambah pengeluaran baru
router.post('/', expenseController.createExpense);

// Mengambil semua daftar pengeluaran
router.get('/', expenseController.getAllExpenses);

// Menghapus satu pengeluaran berdasarkan ID
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;