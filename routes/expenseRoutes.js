const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Endpoint: /api/expenses
router.post('/', expenseController.createExpense);
router.get('/', expenseController.getAllExpenses);

module.exports = router;