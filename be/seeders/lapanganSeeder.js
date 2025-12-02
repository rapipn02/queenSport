const db = require('../config/database');

async function seedLapangan() {
  try {
    console.log('🌱 Memulai seeding data lapangan...');

    // Check if data already exists
    const [existing] = await db.query('SELECT COUNT(*) as count FROM lapangan');
    
    if (existing[0].count > 0) {
      console.log('⚠️  Data lapangan sudah ada, skip seeding');
      return;
    }

    // Insert sample data
    const lapanganData = [
      ['Futsal A', 'Futsal', 100000, 'Tersedia'],
      ['Badminton A', 'Badminton', 40000, 'Tersedia'],
      ['Badminton B', 'Badminton', 40000, 'Tersedia'],
      ['Badminton C', 'Badminton', 40000, 'Tersedia']
    ];

    for (const lapangan of lapanganData) {
      await db.query(
        'INSERT INTO lapangan (nama_lapangan, jenis, harga, status) VALUES (?, ?, ?, ?)',
        lapangan
      );
    }

    console.log('✅ Seeding lapangan berhasil!');
    console.log('📊 Data yang ditambahkan:');
    console.log('   - Futsal A (Rp100.000) - Tersedia');
    console.log('   - Badminton A (Rp40.000) - Tersedia');
    console.log('   - Badminton B (Rp40.000) - Tersedia');
    console.log('   - Badminton C (Rp40.000) - Tidak Tersedia');

  } catch (error) {
    console.error('❌ Error seeding lapangan:', error);
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedLapangan()
    .then(() => {
      console.log('✨ Seeding selesai');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding gagal:', error);
      process.exit(1);
    });
}

module.exports = seedLapangan;
