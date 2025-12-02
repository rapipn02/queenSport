-- Add expiry_time column to pembayaran table
ALTER TABLE pembayaran ADD COLUMN expiry_time DATETIME NULL;

-- Update jadwal status enum to include 'Reserved'
ALTER TABLE jadwal MODIFY COLUMN status ENUM('Tersedia', 'Reserved', 'Dibooking') DEFAULT 'Tersedia';

-- Update booking status enum to include 'Pending'
ALTER TABLE booking MODIFY COLUMN status ENUM('Pending', 'Menunggu', 'Dikonfirmasi', 'Dibatalkan') DEFAULT 'Pending';

-- Add index for faster query
CREATE INDEX idx_pembayaran_expiry ON pembayaran(expiry_time, transaction_status);
CREATE INDEX idx_jadwal_status ON jadwal(status, tanggal, id_lapangan);
