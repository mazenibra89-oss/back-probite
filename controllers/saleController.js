const Sale = require('../models/Sale');
const Product = require('../models/Product');

/**
 * Membuat Transaksi Baru (Checkout)
 */
exports.createSale = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, city } = req.body;
    let calculatedTotalProfit = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const hpp = product.hpp || (product.price * 0.7);
        calculatedTotalProfit += (item.price - hpp) * item.quantity;
        
        product.stock -= item.quantity;
        if (product.stock < 0) product.stock = 0;
        await product.save();
      }
    }

    const newSale = new Sale({
      queueNumber: `PB-${Date.now().toString().slice(-4)}`,
      items,
      totalAmount,
      totalProfit: calculatedTotalProfit,
      paymentMethod: paymentMethod || 'Cash',
      city: city || 'Semarang',
      status: 'Selesai',
      paid: false // Default belum dibayar
    });

    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (err) {
    res.status(400).json({ message: "Gagal checkout", error: err.message });
  }
};

/**
 * Mengambil Riwayat Penjualan (Admin)
 */
exports.getSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update Status Pembayaran (Fungsi Tombol Sudah Dibayar)
 */
exports.updateSaleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paid } = req.body;

    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      { paid: paid },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.json(updatedSale);
  } catch (err) {
    res.status(400).json({ message: "Gagal update status", error: err.message });
  }
};