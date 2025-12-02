const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

async function seedUsers() {
  try {
    console.log('🌱 Starting user seeder...');

    // Data user yang akan di-seed
    const users = [
      {
        username: 'rapip',
        password: 'rapipneo1'
      },
      {
        username: 'rifa',
        password: 'rifareslab1'
      },
      {
        username: 'keamananinformasi2',
        password: 'menyenangkan1'
      }
    ];

    // Hapus semua user lama (opsional)
    await db.query('DELETE FROM user');
    console.log('🗑️  Old users deleted');

    // Reset auto increment
    await db.query('ALTER TABLE user AUTO_INCREMENT = 1');

    // Insert users baru
    for (const user of users) {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert ke database
      const [result] = await db.query(
        'INSERT INTO user (username, password) VALUES (?, ?)',
        [user.username, hashedPassword]
      );

      console.log(`✅ User created: ${user.username} (ID: ${result.insertId})`);
    }

    console.log('🎉 Seeder completed successfully!');
    console.log('\n📋 User List:');
    console.log('─────────────────────────────────');
    users.forEach(user => {
      console.log(`Username: ${user.username} | Password: ${user.password}`);
    });
    console.log('─────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
}

// Jalankan seeder
seedUsers();