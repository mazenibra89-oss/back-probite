const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Logika untuk Pendaftaran (Register)
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek duplikasi
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username sudah digunakan!" });
    }

    // Buat user baru (Password akan di-hash otomatis oleh model/User.js)
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "Registrasi berhasil!" });
  } catch (err) {
    res.status(500).json({ message: "Gagal registrasi", error: err.message });
  }
};

// 2. Logika untuk Masuk (Login)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Username tidak ditemukan!" });
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah!" });
    }

    // Buat Token JWT
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username 
      } 
    });

  } catch (err) {
    res.status(500).json({ message: "Kesalahan server saat login", error: err.message });
  }
};