const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const seedAdmin = require('./seeders/adminSeeder');

// Load environment variables
dotenv.config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const expenseRoutes = require('./routes/expenseRoutes'); // Import rute pengeluaran baru

const app = express();

// --- KONFIGURASI UPLOAD GAMBAR (MULTER) ---

// Pastikan folder 'uploads' tersedia secara otomatis di server
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Menghasilkan nama unik: timestamp-nama_file.ext
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file 5MB
});

// --- MIDDLEWARE ---

// Konfigurasi CORS agar Frontend (Vercel/Local) bisa mengakses API
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Middleware untuk memproses body permintaan dalam format JSON
app.use(express.json());

// Akses publik untuk folder uploads agar gambar produk bisa tampil di browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---

/**
 * 1. Endpoint Upload Gambar
 * Digunakan saat menambah atau mengedit produk di Admin Panel
 */
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
    }
    // Menghasilkan URL lengkap (e.g., http://localhost:5000/uploads/123.jpg)
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server Error saat upload', error: err.message });
  }
});

/**
 * 2. Health Check
 */
app.get('/', (req, res) => {
  res.send('🚀 Probite POS API is running with Upload & Expense Support...');
});

/**
 * 3. Pendaftaran Endpoint API Utama
 */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/expenses', expenseRoutes); // Pendaftaran endpoint pengeluaran

// --- DATABASE & SERVER ---

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Menghubungkan ke MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Terhubung!');
    
    // Menjalankan seeder untuk membuat akun admin default jika belum ada
    await seedAdmin(); 

    // Menjalankan server Node.js
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
      console.log(`📂 Folder upload aktif di: ${uploadDir}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Menghentikan aplikasi jika gagal koneksi database
  });