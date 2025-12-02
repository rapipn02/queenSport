# API Lapangan (Facilities)

Base URL: `http://localhost:5000/api/lapangan`

## Endpoints

### 1. Get All Lapangan
**GET** `/api/lapangan`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id_lapangan": 1,
      "nama_lapangan": "Futsal A",
      "jenis": "Futsal",
      "harga": "100000.00",
      "status": "Tersedia"
    }
  ]
}
```

### 2. Get Lapangan by ID
**GET** `/api/lapangan/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id_lapangan": 1,
    "nama_lapangan": "Futsal A",
    "jenis": "Futsal",
    "harga": "100000.00",
    "status": "Tersedia"
  }
}
```

### 3. Get Lapangan Statistics
**GET** `/api/lapangan/stats`

Response:
```json
{
  "success": true,
  "data": {
    "lapangan_aktif": 3,
    "lapangan_tidak_aktif": 1,
    "total_lapangan": 4
  }
}
```

### 4. Create Lapangan
**POST** `/api/lapangan`

Request Body:
```json
{
  "nama_lapangan": "Futsal B",
  "jenis": "Futsal",
  "harga": 100000,
  "status": "Tersedia"
}
```

Response:
```json
{
  "success": true,
  "message": "Lapangan berhasil ditambahkan",
  "data": {
    "id_lapangan": 5,
    "nama_lapangan": "Futsal B",
    "jenis": "Futsal",
    "harga": "100000.00",
    "status": "Tersedia"
  }
}
```

### 5. Update Lapangan
**PUT** `/api/lapangan/:id`

Request Body:
```json
{
  "nama_lapangan": "Futsal A Updated",
  "jenis": "Futsal",
  "harga": 120000,
  "status": "Tersedia"
}
```

Response:
```json
{
  "success": true,
  "message": "Lapangan berhasil diupdate",
  "data": {
    "id_lapangan": 1,
    "nama_lapangan": "Futsal A Updated",
    "jenis": "Futsal",
    "harga": "120000.00",
    "status": "Tersedia"
  }
}
```

### 6. Delete Lapangan
**DELETE** `/api/lapangan/:id`

Response:
```json
{
  "success": true,
  "message": "Lapangan berhasil dihapus"
}
```

## Default Harga
- **Futsal**: Rp100.000 per jam
- **Badminton**: Rp40.000 per jam

## Status Options
- `Tersedia` - Lapangan aktif dan bisa dibooking
- `Tidak Tersedia` - Lapangan tidak aktif

## Testing dengan cURL

### Get All Lapangan
```bash
curl http://localhost:5000/api/lapangan
```

### Create Lapangan
```bash
curl -X POST http://localhost:5000/api/lapangan \
  -H "Content-Type: application/json" \
  -d '{
    "nama_lapangan": "Futsal B",
    "jenis": "Futsal",
    "harga": 100000,
    "status": "Tersedia"
  }'
```

### Update Lapangan
```bash
curl -X PUT http://localhost:5000/api/lapangan/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nama_lapangan": "Futsal A Updated",
    "jenis": "Futsal",
    "harga": 120000,
    "status": "Tersedia"
  }'
```

### Delete Lapangan
```bash
curl -X DELETE http://localhost:5000/api/lapangan/1
```

## Seeding Data

Untuk menambahkan data awal lapangan, jalankan:

```bash
node seeders/lapanganSeeder.js
```

Atau jalankan semua seeder:

```bash
node seeders/index.js
```

Data yang akan ditambahkan:
- Futsal A (Rp100.000) - Tersedia
- Badminton A (Rp40.000) - Tersedia
- Badminton B (Rp40.000) - Tersedia
- Badminton C (Rp40.000) - Tidak Tersedia
