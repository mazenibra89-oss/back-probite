const Expense = require('../models/Expense');

/**
 * Tambah Pengeluaran Baru
 * Menangani penyimpanan data pengeluaran berdasarkan cabang (Jogja/Semarang)
 */
exports.createExpense = async (req, res) => {
  try {
    const { description, quantity, unit, amount, branch, createdAt } = req.body;

    // Validasi input cabang
    if (!['Jogja', 'Semarang'].includes(branch)) {
      return res.status(400).json({ message: "Cabang harus Jogja atau Semarang" });
    }

    const newExpense = new Expense({
      description,
      quantity,
      unit,
      amount,
      branch,
      createdAt: createdAt || new Date()
    });

    await newExpense.save(); // Simpan ke database
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: "Gagal menyimpan pengeluaran", error: err.message });
  }
};

/**
 * Ambil Semua Riwayat Pengeluaran
 * Mengembalikan semua data pengeluaran untuk laporan
 */
exports.getAllExpenses = async (req, res) => {
  try {
    // Diurutkan dari yang terbaru berdasarkan tanggal input
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data pengeluaran", error: err.message });
  }
};

/**
 * Hapus Pengeluaran
 * Menghapus data berdasarkan ID yang dikirim dari frontend
 */
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedExpense = await Expense.findByIdAndDelete(id); // Cari dan hapus

    if (!deletedExpense) {
      return res.status(404).json({ message: "Data pengeluaran tidak ditemukan" });
    }

    res.json({ success: true, message: "Pengeluaran berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error saat menghapus data", error: err.message });
  }
};