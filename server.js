const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const seedAdmin = require('./seeders/adminSeeder');

// Load environment variables
dotenv.config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();

// --- MIDDLEWARE ---

// Konfigurasi CORS: Mengizinkan frontend (Vercel) mengakses backend
app.use(cors({
  origin: true, // Set true untuk mengizinkan semua domain selama masa development/deploy
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Middleware untuk membaca JSON body
app.use(express.json());

// --- ROUTES ---

// Route Dashboard/Check (Optional)
app.get('/', (req, res) => {
  res.send('🚀 Probite POS API is running...');
});

// Pendaftaran Endpoint API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

// --- DATABASE & SERVER ---

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Terhubung!');
    
    // Jalankan migrasi/seed admin otomatis saat server pertama kali jalan
    await seedAdmin(); 

    // Jalankan Server setelah database terhubung
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`📡 Akses publik tersedia melalui port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Hentikan proses jika DB tidak bisa terhubung
  });