-- Update tabel booking untuk menambahkan email (jika belum ada)
ALTER TABLE booking ADD COLUMN email VARCHAR(100) AFTER no_telepon;

-- Update tabel pembayaran untuk Midtrans
ALTER TABLE pembayaran ADD COLUMN order_id VARCHAR(100) UNIQUE AFTER id_pembayaran;
ALTER TABLE pembayaran ADD COLUMN transaction_status VARCHAR(50) DEFAULT 'pending' AFTER metode;
ALTER TABLE pembayaran MODIFY metode VARCHAR(100);
