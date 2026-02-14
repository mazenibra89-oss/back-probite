const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    default: 'Owner'
  }
}, { 
  timestamps: true // Otomatis membuat createdAt dan updatedAt
});

/**
 * Middleware pre-save untuk Hashing Password.
 * Kita menggunakan async function tanpa parameter 'next'.
 * Mongoose secara otomatis menangani penyelesaian fungsi async.
 */
userSchema.pre('save', async function() {
  // Hanya jalankan hashing jika password baru atau sedang diubah
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // Jika terjadi error, lemparkan error agar proses save berhenti
    throw error;
  }
});

module.exports = mongoose.model('User', userSchema);