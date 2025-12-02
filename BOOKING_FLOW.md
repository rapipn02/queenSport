# Flow Booking dengan Integrasi API & Database

## Alur Lengkap Booking

### 1. Halaman Booking (Isi Data Pemesanan)
**File**: `fe/src/pages/user/Booking.jsx`

**Fungsi**:
- User mengisi data: Nama, No. HP, Email
- Data disimpan ke `localStorage` dengan key `bookingUserData`
- Button "Lanjut" redirect ke `/booking-schedule`

**Validasi**:
- Semua field wajib diisi

---

### 2. Halaman Booking Schedule (Pilih Jadwal)
**File**: `fe/src/pages/user/BookingSchedule.jsx`

**Fungsi**:
- Load daftar lapangan dari API: `GET /api/lapangan`
- User memilih:
  - Lapangan (dropdown)
  - Tanggal (calendar)
  - Jam booking (multiple selection)
- Hitung total harga otomatis
- Button "Lanjut" → **SIMPAN KE DATABASE** via API

**API Call** (Button Lanjut):
```javascript
POST /api/booking
Body: {
  nama: string,
  no_telepon: string,
  email: string,
  id_lapangan: number,
  tanggal_booking: "YYYY-MM-DD",
  jam_slots: [
    { jam_mulai: "09.00", jam_selesai: "10.00" },
    { jam_mulai: "10.00", jam_selesai: "11.00" }
  ],
  jenis_pembayaran: "DP" // atau "Lunas"
}
```

**Response**:
```javascript
{
  success: true,
  data: {
    booking: {
      id_booking: 1,
      nama: "...",
      no_telepon: "...",
      email: "...",
      total_harga: 100000,
      status_booking: "Menunggu",
      ...
    },
    snap_token: "xxx-midtrans-token-xxx"
  }
}
```

**Database Changes**:
- Insert ke tabel `booking`
- Insert ke tabel `jadwal` (untuk setiap jam slot)
- Insert ke tabel `pembayaran` dengan `order_id` dari Midtrans
- **Data sudah tersimpan di database pada tahap ini!**

**Redirect**: Ke `/booking-detail` dengan state data booking

---

### 3. Halaman Booking Detail (Review Pemesanan)
**File**: `fe/src/pages/user/BookingDetail.jsx`

**Fungsi**:
- Menampilkan detail booking yang **sudah tersimpan di database**
- Data diambil dari navigation state (location.state)
- Menampilkan:
  - Data pemesanan (nama, HP, email)
  - Detail booking (lapangan, tanggal, jam)
  - Total harga
  - Harga DP (50% dari total)
- Button "BAYAR" → redirect ke `/payment`

**Data Source**:
- Primary: `location.state` (dari navigate)
- Fallback: `localStorage` jika state hilang

---

### 4. Halaman Payment (Pembayaran Midtrans)
**File**: `fe/src/pages/user/Payment.jsx`

**Fungsi**:
- Menampilkan detail booking dan total yang harus dibayar
- Button "Bayar Sekarang" → Buka Midtrans Snap popup
- Handle payment result:
  - **Success**: Update status di database via webhook, redirect ke `/my-bookings`
  - **Pending**: Status tetap menunggu, redirect ke `/my-bookings`
  - **Failed**: Tampilkan error, user bisa coba lagi

**Midtrans Snap**:
```javascript
window.snap.pay(snapToken, {
  onSuccess: (result) => {
    // Webhook otomatis update database
    // Status booking: "Dikonfirmasi"
    // Status pembayaran: "settlement"
  },
  onPending: (result) => {
    // Status tetap "Menunggu"
  }
})
```

**Webhook** (Otomatis):
- Midtrans kirim notifikasi ke `POST /api/payment/midtrans/notification`
- Backend update status di database:
  - `pembayaran.transaction_status` → "settlement"/"pending"/"cancel"
  - `booking.status_booking` → "Dikonfirmasi"/"Menunggu"/"Dibatalkan"

---

## Data Flow Summary

```
1. Booking.jsx (User Input)
   └─> localStorage (temporary)
   
2. BookingSchedule.jsx (Schedule Selection)
   └─> API POST /api/booking
       └─> DATABASE SAVE ✓
           ├─> tabel: booking
           ├─> tabel: jadwal (multiple rows)
           └─> tabel: pembayaran
       └─> Return: booking data + snap_token
   
3. BookingDetail.jsx (Review)
   └─> Display data from database
   
4. Payment.jsx (Payment)
   └─> Midtrans Snap
       └─> Webhook update DATABASE ✓
           ├─> pembayaran.transaction_status
           └─> booking.status_booking
```

---

## Testing Flow

### Setup
1. Pastikan backend running: `cd be && node index.js`
2. Pastikan frontend running: `cd fe && npm run dev`
3. Pastikan MySQL running
4. Database `queensport` sudah ter-update schema

### Test Steps

1. **Isi Data Pemesanan**:
   ```
   Buka: http://localhost:3000/booking
   Isi: Nama, HP, Email
   Klik: Lanjut
   ```

2. **Pilih Jadwal**:
   ```
   Pilih: Lapangan (contoh: Futsal A)
   Pilih: Tanggal
   Pilih: Jam (bisa multiple)
   Lihat: Total harga otomatis hitung
   Klik: Lanjut
   ```
   
   **Check Database**:
   ```sql
   SELECT * FROM booking ORDER BY id_booking DESC LIMIT 1;
   SELECT * FROM jadwal WHERE id_booking = [id_booking_terbaru];
   SELECT * FROM pembayaran WHERE id_booking = [id_booking_terbaru];
   ```

3. **Review Booking Detail**:
   ```
   Lihat: Data lengkap booking
   Check: Harga DP 50%
   Klik: BAYAR
   ```

4. **Payment**:
   ```
   Klik: Bayar Sekarang
   Popup Midtrans akan muncul
   Gunakan test card: 4811 1111 1111 1114
   ```
   
   **Check Database After Payment**:
   ```sql
   SELECT * FROM booking WHERE id_booking = [id];
   -- status_booking should be "Dikonfirmasi"
   
   SELECT * FROM pembayaran WHERE id_booking = [id];
   -- transaction_status should be "settlement"
   ```

---

## Environment Variables

### Backend (.env)
```env
MIDTRANS_SERVER_KEY=SB-Mid-server-n5-B-2C7lrs9XBd9ONn3s8UW
MIDTRANS_CLIENT_KEY=SB-Mid-client-BJIR2i1bWQNjYCA_
MIDTRANS_IS_PRODUCTION=false
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-BJIR2i1bWQNjYCA_
```

---

## Troubleshooting

### 1. Button "Lanjut" tidak menyimpan ke database
- Check: Backend server running?
- Check: Console browser ada error?
- Check: Network tab di DevTools (status 200?)
- Check: Response dari API success?

### 2. Data tidak muncul di Booking Detail
- Check: navigation state ada?
- Check: localStorage ada bookingId?
- Check: Console error?

### 3. Payment tidak muncul popup
- Check: Script Midtrans loaded? (lihat Network tab)
- Check: snapToken ada?
- Check: window.snap exists?

### 4. Webhook tidak update database
- Check: Webhook URL configured di Midtrans Dashboard
- Check: Backend endpoint `/api/payment/midtrans/notification` accessible
- Check: Backend log untuk incoming webhook

---

## Database Schema

### Tabel: booking
```sql
id_booking (PK)
nama
no_telepon
email          -- NEW FIELD
tanggal_booking
total_harga
status_booking -- "Menunggu", "Dikonfirmasi", "Dibatalkan"
created_at
```

### Tabel: jadwal
```sql
id_jadwal (PK)
id_booking (FK)
id_lapangan (FK)
tanggal_booking
jam_mulai
jam_selesai
status         -- "Tersedia", "Booked"
```

### Tabel: pembayaran
```sql
id_pembayaran (PK)
id_booking (FK)
jumlah
metode
order_id           -- NEW FIELD (Midtrans)
transaction_status -- NEW FIELD (pending/settlement/cancel/deny/expire)
tanggal_pembayaran
```

---

## Notes

1. **Data Persistence**: Data booking tersimpan di database SEBELUM user bayar
2. **Payment Status**: Status booking update otomatis via Midtrans webhook
3. **DP vs Lunas**: Default DP (50%), bisa diubah di BookingSchedule
4. **Multiple Time Slots**: User bisa pilih multiple jam sekaligus
5. **Midtrans Sandbox**: Gunakan test card untuk testing
