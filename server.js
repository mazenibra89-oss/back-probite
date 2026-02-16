const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const seedAdmin = require('./seeders/adminSeeder');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const app = express();

// PENTING: Ganti origin dengan domain Vercel kamu
app.use(cors({
  origin: true, // Mengizinkan semua domain (termasuk vercel) untuk sementara
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

app.use('/', (req, res) => {
  res.send('Selamat datang di API POS!');
});

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Terhubung!');
    // Jalankan migrasi data setiap server restart
    await seedAdmin(); 
  })
  .catch(err => console.error('❌ MongoDB Error:', err.message));

const PORT = process.env.PORT || 5000;
// Di server sendiri, gunakan 0.0.0.0 agar bisa diakses dari IP publik
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});