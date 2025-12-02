# API Booking Documentation

Base URL: `http://localhost:5000/api/booking`

## Endpoints

### 1. Create Booking
**POST** `/api/booking`

Create new booking dengan pemilihan jam dan integrasi Midtrans payment.

**Request Body:**
```json
{
  "id_lapangan": 1,
  "nama": "Faiz Ramadhan",
  "no_telepon": "08123456789",
  "email": "faiz@gmail.com",
  "tanggal": "2025-12-01",
  "jam_slots": ["09.00", "10.00", "11.00"],
  "metode_pembayaran": "DP"
}
```

**Field Descriptions:**
- `id_lapangan` (required): ID lapangan yang akan dibooking
- `nama` (required): Nama pemesan
- `no_telepon` (required): Nomor HP pemesan
- `email` (optional): Email pemesan
- `tanggal` (required): Tanggal booking (YYYY-MM-DD)
- `jam_slots` (required): Array jam yang dipilih ['09.00', '10.00', ...]
- `metode_pembayaran` (required): 'DP' (50%) atau 'Lunas' (100%)

**Response Success:**
```json
{
  "success": true,
  "message": "Booking berhasil dibuat",
  "data": {
    "id_booking": 1,
    "order_id": "BOOKING-1-1732976400000",
    "snap_token": "66e4fa55-fdac-4ef9-91b5-733b97d1838c",
    "snap_redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/66e4fa55...",
    "total_harga": 300000,
    "jumlah_bayar": 150000,
    "durasi_jam": 3
  }
}
```

**Response Error - Jadwal Tidak Tersedia:**
```json
{
  "success": false,
  "message": "Jadwal sudah dibooking"
}
```

---

### 2. Get All Bookings
**GET** `/api/booking`

Get semua data booking (untuk admin).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_booking": 1,
      "id_jadwal": 1,
      "nama": "Faiz Ramadhan",
      "no_telepon": "08123456789",
      "email": "faiz@gmail.com",
      "tanggal_booking": "2025-12-01",
      "durasi_jam": 3,
      "total_harga": "300000.00",
      "status": "Dikonfirmasi",
      "tanggal": "2025-12-01",
      "jam_mulai": "09:00:00",
      "jam_selesai": "12:00:00",
      "nama_lapangan": "Futsal A",
      "jenis": "Futsal",
      "harga": "100000.00"
    }
  ]
}
```

---

### 3. Get Booking by ID
**GET** `/api/booking/:id`

Get detail booking berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id_booking": 1,
    "nama": "Faiz Ramadhan",
    "no_telepon": "08123456789",
    "email": "faiz@gmail.com",
    "tanggal_booking": "2025-12-01",
    "durasi_jam": 3,
    "total_harga": "300000.00",
    "status": "Dikonfirmasi",
    "nama_lapangan": "Futsal A",
    "jenis": "Futsal",
    "harga": "100000.00",
    "pembayaran": {
      "id_pembayaran": 1,
      "order_id": "BOOKING-1-1732976400000",
      "jumlah_bayar": "150000.00",
      "metode": "DP",
      "transaction_status": "settlement",
      "tanggal_bayar": "2025-11-30"
    }
  }
}
```

---

### 4. Get Bookings by User
**GET** `/api/booking/user/:identifier`

Get semua booking user berdasarkan email atau nomor HP.

**Example:**
```
GET /api/booking/user/faiz@gmail.com
GET /api/booking/user/08123456789
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_booking": 1,
      "nama": "Faiz Ramadhan",
      "tanggal_booking": "2025-12-01",
      "status": "Dikonfirmasi",
      "nama_lapangan": "Futsal A"
    }
  ]
}
```

---

### 5. Update Booking
**PUT** `/api/booking/:id`

Update data booking (untuk admin).

**Request Body:**
```json
{
  "nama": "Faiz Updated",
  "no_telepon": "08999999999",
  "email": "newemail@gmail.com",
  "status": "Dikonfirmasi"
}
```

**Status Options:**
- `Menunggu` - Menunggu pembayaran
- `Dikonfirmasi` - Pembayaran berhasil
- `Dibatalkan` - Dibatalkan

**Response:**
```json
{
  "success": true,
  "message": "Booking berhasil diupdate",
  "data": {
    "id_booking": 1,
    "nama": "Faiz Updated",
    "status": "Dikonfirmasi"
  }
}
```

---

### 6. Delete Booking
**DELETE** `/api/booking/:id`

Delete booking dan kembalikan jadwal ke status tersedia.

**Response:**
```json
{
  "success": true,
  "message": "Booking berhasil dihapus"
}
```

---

## Flow Booking Lengkap

### 1. User Memilih Lapangan & Jam
```javascript
// Frontend: User pilih lapangan, tanggal, dan jam
const bookingData = {
  id_lapangan: 1,
  nama: "John Doe",
  no_telepon: "08123456789",
  email: "john@example.com",
  tanggal: "2025-12-01",
  jam_slots: ["09.00", "10.00", "11.00"], // 3 jam
  metode_pembayaran: "DP" // atau "Lunas"
};
```

### 2. Create Booking via API
```javascript
const response = await fetch('http://localhost:5000/api/booking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bookingData)
});

const result = await response.json();
// result.data.snap_token untuk Midtrans
```

### 3. Open Midtrans Snap Payment
```javascript
// Frontend: Load Midtrans Snap
window.snap.pay(result.data.snap_token, {
  onSuccess: function(result) {
    // Pembayaran berhasil
    console.log('success', result);
    // Redirect ke halaman success
  },
  onPending: function(result) {
    // Pembayaran pending
    console.log('pending', result);
  },
  onError: function(result) {
    // Pembayaran error
    console.log('error', result);
  }
});
```

### 4. Backend Receive Notification
```
Midtrans → POST /api/payment/midtrans/notification
↓
Update pembayaran status
↓
Update booking status
```

### 5. Check Status
```javascript
// Frontend: Check payment status
const status = await fetch(`http://localhost:5000/api/payment/status/${order_id}`);
```

---

## Kalkulasi Harga

### Contoh Perhitungan:

**Lapangan:** Futsal A (Rp100.000/jam)
**Jam Dipilih:** 09.00, 10.00, 11.00 (3 jam)

**Total Harga:** 3 × Rp100.000 = Rp300.000

**Metode Pembayaran:**
- **DP (50%):** Rp150.000
- **Lunas (100%):** Rp300.000

---

## Time Slots Format

Jam slots harus dalam format `HH.MM`:
```json
["07.00", "08.00", "09.00", ..., "23.00"]
```

Backend akan otomatis:
- Sort jam slots
- Ambil jam_mulai dari slot pertama
- Hitung jam_selesai = jam terakhir + 1 jam

**Example:**
```json
"jam_slots": ["10.00", "09.00", "11.00"]
```

Akan menjadi:
- `jam_mulai`: "09.00"
- `jam_selesai`: "12.00" (11.00 + 1)
- `durasi_jam`: 3

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Data tidak lengkap"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Lapangan tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Gagal membuat booking",
  "error": "Error details..."
}
```

---

## Testing dengan cURL

### Create Booking:
```bash
curl -X POST http://localhost:5000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "id_lapangan": 1,
    "nama": "Test User",
    "no_telepon": "08123456789",
    "email": "test@example.com",
    "tanggal": "2025-12-01",
    "jam_slots": ["09.00", "10.00"],
    "metode_pembayaran": "DP"
  }'
```

### Get All Bookings:
```bash
curl http://localhost:5000/api/booking
```

### Get User Bookings:
```bash
curl http://localhost:5000/api/booking/user/08123456789
```

### Update Booking:
```bash
curl -X PUT http://localhost:5000/api/booking/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Updated Name",
    "no_telepon": "08999999999",
    "email": "new@example.com",
    "status": "Dikonfirmasi"
  }'
```

### Delete Booking:
```bash
curl -X DELETE http://localhost:5000/api/booking/1
```
