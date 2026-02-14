const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // 1. Cek apakah sudah ada user dengan username 'admin'
    const adminExists = await User.findOne({ username: 'admin' });

    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        password: 'admin123', // Password ini akan otomatis di-hash oleh model User.js kita
        role: 'Owner'
      });

      await admin.save();
      console.log('✅ Default Admin created: admin / admin123');
    } else {
      console.log('ℹ️ Admin user already exists, skipping seed.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;