# Setup Midtrans Payment Gateway

## 1. Dapatkan API Keys dari Midtrans

### Untuk Development/Sandbox:
1. Daftar di https://dashboard.sandbox.midtrans.com/register
2. Login ke dashboard
3. Pergi ke **Settings** → **Access Keys**
4. Copy **Server Key** dan **Client Key**

### Untuk Production:
1. Daftar di https://dashboard.midtrans.com/register
2. Submit dokumen bisnis untuk verifikasi
3. Setelah disetujui, dapatkan Production keys

## 2. Setup Environment Variables

Buka file `.env` dan update:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

**PENTING:**
- Gunakan `SB-` prefix untuk Sandbox keys
- Set `MIDTRANS_IS_PRODUCTION=false` untuk testing
- Set `MIDTRANS_IS_PRODUCTION=true` untuk production

## 3. Update Database Schema

Jalankan SQL untuk update schema:

```bash
mysql -u root -p queensport < database/update_schema.sql
```

Atau manual di MySQL:

```sql
ALTER TABLE booking ADD COLUMN IF NOT EXISTS email VARCHAR(100) AFTER no_telepon;
ALTER TABLE pembayaran ADD COLUMN IF NOT EXISTS order_id VARCHAR(100) UNIQUE AFTER id_pembayaran;
ALTER TABLE pembayaran ADD COLUMN IF NOT EXISTS transaction_status VARCHAR(50) DEFAULT 'pending' AFTER metode;
ALTER TABLE pembayaran MODIFY metode VARCHAR(50);
```

## 4. Install Dependencies (Sudah Terinstall)

```bash
npm install midtrans-client
```

## 5. Test API Booking

### Create Booking:

```bash
curl -X POST http://localhost:5000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "id_lapangan": 1,
    "nama": "John Doe",
    "no_telepon": "08123456789",
    "email": "john@example.com",
    "tanggal": "2025-12-01",
    "jam_slots": ["09.00", "10.00", "11.00"],
    "metode_pembayaran": "DP"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Booking berhasil dibuat",
  "data": {
    "id_booking": 1,
    "order_id": "BOOKING-1-1732976400000",
    "snap_token": "xxxx-xxxx-xxxx",
    "snap_redirect_url": "https://app.sandbox.midtrans.com/snap/v2/...",
    "total_harga": 300000,
    "jumlah_bayar": 150000,
    "durasi_jam": 3
  }
}
```

## 6. Flow Pembayaran

### A. User Side (Frontend):

1. **Create Booking**
   - POST `/api/booking`
   - Dapatkan `snap_token`

2. **Open Midtrans Snap**
   ```javascript
   snap.pay(snap_token, {
     onSuccess: function(result) {
       // Payment success
       console.log(result);
     },
     onPending: function(result) {
       // Payment pending
       console.log(result);
     },
     onError: function(result) {
       // Payment error
       console.log(result);
     },
     onClose: function() {
       // User closed popup
     }
   });
   ```

3. **Check Payment Status**
   - GET `/api/payment/status/:order_id`

### B. Backend Side:

1. **Receive Notification dari Midtrans**
   - POST `/api/payment/midtrans/notification`
   - Webhook dari Midtrans
   - Update status booking otomatis

2. **Update Booking Status:**
   - `pending` → Booking: "Menunggu"
   - `settlement` → Booking: "Dikonfirmasi"
   - `cancel/deny/expire` → Booking: "Dibatalkan"

## 7. Setup Webhook Notification (Optional untuk Testing)

Di Midtrans Dashboard:
1. Settings → Configuration
2. Payment Notification URL: `https://yourdomain.com/api/payment/midtrans/notification`
3. Recurring Notification URL: (sama)

**Untuk Development:**
- Gunakan ngrok untuk expose local server:
  ```bash
  ngrok http 5000
  ```
- Copy HTTPS URL ke Midtrans Dashboard

## 8. Test dengan Midtrans Sandbox

### Credit Card untuk Testing:
- **Card Number:** 4811 1111 1111 1114
- **CVV:** 123
- **Exp Date:** 01/25

### Bank Transfer (Virtual Account):
- Pilih bank (BCA, Mandiri, BNI, etc)
- Copy VA number
- Simulate payment di simulator Midtrans

### E-Wallet:
- Gopay, ShopeePay, dll
- Akan muncul popup simulasi

## 9. API Endpoints

### Booking:
- `POST /api/booking` - Create booking
- `GET /api/booking` - Get all bookings
- `GET /api/booking/:id` - Get booking by ID
- `GET /api/booking/user/:identifier` - Get user bookings
- `PUT /api/booking/:id` - Update booking
- `DELETE /api/booking/:id` - Delete booking

### Payment:
- `POST /api/payment/midtrans/notification` - Webhook notification
- `GET /api/payment/status/:order_id` - Check payment status
- `GET /api/payment` - Get all payments (admin)
- `GET /api/payment/booking/:booking_id` - Get payment by booking

## 10. Status Flow

### Transaction Status:
- `pending` - Menunggu pembayaran
- `settlement` - Pembayaran sukses
- `capture` - Kartu kredit authorized
- `deny` - Ditolak
- `cancel` - Dibatalkan
- `expire` - Kadaluarsa

### Booking Status:
- `Menunggu` - Menunggu pembayaran
- `Dikonfirmasi` - Pembayaran berhasil
- `Dibatalkan` - Pembayaran gagal/dibatalkan

## 11. Security Notes

⚠️ **JANGAN** commit API keys ke repository!
⚠️ **JANGAN** expose Server Key di frontend!
⚠️ **ALWAYS** validate notification dari Midtrans

## 12. Troubleshooting

### Error: "Invalid signature"
- Pastikan Server Key benar
- Check Midtrans dashboard untuk API keys

### Error: "Order ID already exists"
- Order ID harus unique
- Sudah handled dengan timestamp

### Notification tidak diterima
- Check webhook URL di dashboard
- Pastikan server accessible dari internet
- Check logs di Midtrans dashboard

## 13. Production Checklist

- [ ] Ganti ke Production keys
- [ ] Set `MIDTRANS_IS_PRODUCTION=true`
- [ ] Setup HTTPS
- [ ] Update webhook URL
- [ ] Test semua payment methods
- [ ] Setup monitoring
- [ ] Backup database regularly
