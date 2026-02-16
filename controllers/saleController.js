const Sale = require('../models/Sale');
const Product = require('../models/Product');

/**
 * Membuat Transaksi Baru (Checkout)
 * Menangani: Pengurangan stok, perhitungan profit, dan penyimpanan ke DB
 */
exports.createSale = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, city } = req.body;
    
    let calculatedTotalProfit = 0;

    // Loop setiap item untuk update stok dan hitung profit secara akurat
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (product) {
        // 1. Hitung Profit: (Harga Jual - HPP) * Jumlah
        // Jika HPP tidak ada, kita asumsikan profit 30% dari harga jual sebagai cadangan
        const hpp = product.hpp || (product.price * 0.7);
        calculatedTotalProfit += (item.price - hpp) * item.quantity;

        // 2. Kurangi Stok di Database
        product.stock -= item.quantity;
        
        // Pastikan stok tidak minus (Opsional: berikan validasi jika perlu)
        if (product.stock < 0) product.stock = 0;
        
        await product.save();
      }
    }

    // 3. Buat Record Penjualan Baru
    const newSale = new Sale({
      // Nomor Antrean: PB + 4 angka terakhir timestamp (Contoh: PB-8291)
      queueNumber: `PB-${Date.now().toString().slice(-4)}`,
      items,
      totalAmount,
      totalProfit: calculatedTotalProfit,
      paymentMethod: paymentMethod || 'Cash',
      city: city || 'Semarang',
      status: 'Selesai' // Status default
    });

    const savedSale = await newSale.save();
    
    console.log(`✅ Transaksi Berhasil: ${savedSale.queueNumber}`);
    res.status(201).json(savedSale);

  } catch (err) {
    console.error("❌ Error pada Create Sale:", err.message);
    res.status(400).json({ 
      message: "Gagal memproses transaksi", 
      error: err.message 
    });
  }
};

/**
 * Mengambil Riwayat Penjualan untuk Admin
 */
exports.getSalesHistory = async (req, res) => {
  try {
    // Mengambil semua data, diurutkan dari yang paling baru (terbaru di atas)
    const sales = await Sale.find().sort({ createdAt: -1 });
    
    // Berikan respons array kosong jika tidak ada data, agar frontend tidak crash
    res.json(sales || []);
  } catch (err) {
    console.error("❌ Error pada Get Sales History:", err.message);
    res.status(500).json({ 
      message: "Gagal mengambil riwayat penjualan", 
      error: err.message 
    });
  }
};