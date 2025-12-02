const seedUser = require('./userSeeder');
const seedLapangan = require('./lapanganSeeder');

async function runAllSeeders() {
  try {
    console.log('🚀 Memulai seeding semua data...\n');

    // Run user seeder
    await seedUser();
    console.log('');

    // Run lapangan seeder
    await seedLapangan();
    console.log('');

    console.log('✨ Semua seeding selesai!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error running seeders:', error);
    process.exit(1);
  }
}

runAllSeeders();
