const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  queueNumber: { type: String },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
    hpp: Number // Disimpan saat transaksi agar laporan profit akurat meski harga berubah
  }],
  totalAmount: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash' },
  city: { type: String, default: 'Semarang' },
  status: { type: String, default: 'Selesai' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);