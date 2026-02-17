const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }, // Misal: 'kg', 'liter', 'pcs'
  amount: { type: Number, required: true },
  branch: { 
    type: String, 
    required: true, 
    enum: ['Jogja', 'Semarang'] 
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);