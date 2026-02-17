const Expense = require('../models/Expense');

// Tambah Pengeluaran Baru
exports.createExpense = async (req, res) => {
  try {
    const { description, quantity, unit, amount, branch, createdAt } = req.body;

    // Validasi sederhana (sudah tercover oleh enum di model, tapi bagus untuk custom error)
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

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: "Gagal menyimpan pengeluaran", error: err.message });
  }
};

// Ambil Semua Riwayat Pengeluaran
exports.getAllExpenses = async (req, res) => {
  try {
    // Diurutkan dari yang terbaru berdasarkan tanggal pengeluaran
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data pengeluaran", error: err.message });
  }
};