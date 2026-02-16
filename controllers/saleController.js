const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createSale = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, city } = req.body;
    
    // Hitung profit dan kurangi stok otomatis
    let totalProfit = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalProfit += (item.price - product.hpp) * item.quantity;
        product.stock -= item.quantity; // Kurangi stok
        await product.save();
      }
    }

    const newSale = new Sale({
      items,
      totalAmount,
      totalProfit,
      paymentMethod,
      city,
      queueNumber: `PB-${Date.now().toString().slice(-4)}`
    });

    await newSale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};