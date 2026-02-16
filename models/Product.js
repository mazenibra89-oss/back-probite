const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  hpp: { type: Number, default: 0 },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, default: 'https://picsum.photos/400/400' },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);