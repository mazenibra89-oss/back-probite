const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware CORS diperketat untuk mengizinkan kredensial
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3002"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// Route sapaan untuk cek apakah server hidup
app.get('/', (req, res) => {
  res.send('Backend Probite POS Ready!');
});

// Jalur API
app.use('/api/auth', authRoutes);

// Koneksi Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Terhubung!'))
  .catch(err => {
    console.error('❌ Gagal koneksi ke MongoDB:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server jalan di http://127.0.0.1:${PORT}`);
});