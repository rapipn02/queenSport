# Struktur Folder Frontend - Booking Lapangan Futsal/Bola

## 📁 Struktur Lengkap

```
fe/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── main.jsx                    # Entry point React
│   ├── App.jsx                     # Root component dengan routing
│   ├── index.css                   # Global CSS + Tailwind
│   │
│   ├── pages/                      # Halaman utama aplikasi
│   │   ├── user/                   # 👤 HALAMAN USER
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Login.jsx          # Login user
│   │   │   ├── Register.jsx       # Register user
│   │   │   ├── Facilities.jsx     # Daftar lapangan (futsal/bola)
│   │   │   ├── FacilityDetail.jsx # Detail lapangan + jadwal
│   │   │   ├── Booking.jsx        # Form booking lapangan
│   │   │   ├── Payment.jsx        # Halaman pembayaran (Midtrans)
│   │   │   ├── PaymentSuccess.jsx # Sukses payment
│   │   │   ├── MyBookings.jsx     # Riwayat booking user
│   │   │   └── Profile.jsx        # Profil user
│   │   │
│   │   └── admin/                  # 👨‍💼 HALAMAN ADMIN
│   │       ├── Dashboard.jsx       # Dashboard admin (statistik)
│   │       ├── Login.jsx          # Login admin (bisa terpisah/sama)
│   │       ├── Bookings.jsx       # Kelola semua booking
│   │       ├── BookingDetail.jsx  # Detail booking
│   │       ├── Facilities.jsx     # Kelola lapangan
│   │       ├── Schedule.jsx       # Kelola jadwal & harga
│   │       ├── Users.jsx          # Kelola user
│   │       ├── Payments.jsx       # Kelola pembayaran
│   │       └── Reports.jsx        # Laporan pendapatan
│   │
│   ├── components/                 # Komponen reusable
│   │   ├── common/                # Komponen umum (user & admin)
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── Pagination.jsx
│   │   │
│   │   ├── user/                  # Komponen khusus user
│   │   │   ├── FacilityCard.jsx   # Card untuk tampilan lapangan
│   │   │   ├── ScheduleGrid.jsx   # Grid jadwal waktu booking
│   │   │   ├── BookingForm.jsx    # Form detail booking
│   │   │   ├── PaymentButton.jsx  # Tombol bayar Midtrans
│   │   │   └── BookingCard.jsx    # Card riwayat booking
│   │   │
│   │   └── admin/                 # Komponen khusus admin
│   │       ├── Sidebar.jsx        # Sidebar navigasi admin
│   │       ├── StatCard.jsx       # Card statistik dashboard
│   │       ├── BookingTable.jsx   # Tabel daftar booking
│   │       ├── FacilityForm.jsx   # Form tambah/edit lapangan
│   │       ├── ScheduleForm.jsx   # Form jadwal/harga
│   │       └── UserTable.jsx      # Tabel user
│   │
│   ├── layouts/                    # Layout wrapper
│   │   ├── UserLayout.jsx         # Layout untuk halaman user
│   │   ├── AdminLayout.jsx        # Layout untuk halaman admin
│   │   └── AuthLayout.jsx         # Layout untuk login/register
│   │
│   ├── services/                   # API calls & external services
│   │   ├── api.js                 # Axios instance & interceptors
│   │   ├── authService.js         # Login, register, logout
│   │   ├── bookingService.js      # CRUD booking
│   │   ├── facilityService.js     # CRUD lapangan
│   │   ├── scheduleService.js     # CRUD jadwal
│   │   ├── paymentService.js      # Integrasi Midtrans (client)
│   │   └── userService.js         # CRUD user (admin)
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.js             # Hook untuk autentikasi
│   │   ├── useBooking.js          # Hook untuk booking
│   │   ├── useFacilities.js       # Hook untuk lapangan
│   │   ├── usePayment.js          # Hook untuk payment Midtrans
│   │   └── useDebounce.js         # Debounce untuk search
│   │
│   ├── contexts/                   # React Context
│   │   ├── AuthContext.jsx        # Context autentikasi (user/admin)
│   │   └── BookingContext.jsx     # Context state booking (optional)
│   │
│   ├── utils/                      # Helper functions
│   │   ├── formatters.js          # Format tanggal, harga, dll
│   │   ├── validators.js          # Validasi form
│   │   ├── constants.js           # Konstanta global
│   │   └── helpers.js             # Helper umum
│   │
│   ├── constants/                  # Constants & enums
│   │   ├── routes.js              # Path routes
│   │   ├── apiEndpoints.js        # URL endpoint API
│   │   └── bookingStatus.js       # Status booking (pending, confirmed, dll)
│   │
│   ├── assets/                     # Static assets
│   │   ├── images/                # Gambar (logo, lapangan, dll)
│   │   └── icons/                 # Icons
│   │
│   └── styles/                     # Additional styles (jika perlu)
│       └── custom.css
│
├── .env.example                    # Template environment variables
├── .gitignore
├── package.json
├── tailwind.config.cjs
├── postcss.config.cjs
├── vite.config.js
└── README.md
```

---

## 📚 Library Rekomendasi (Production-Ready)

### Core Dependencies
```bash
npm install react-router-dom      # Routing
npm install axios                  # HTTP client
npm install react-query            # Data fetching & caching (atau TanStack Query)
npm install zustand                # State management (alternatif: Redux Toolkit)
npm install date-fns               # Manipulasi tanggal
npm install react-hot-toast        # Toast notifications (atau react-toastify)
npm install react-icons            # Icon library
```

### Form & Validation
```bash
npm install react-hook-form        # Form handling
npm install yup                    # Schema validation (atau zod)
npm install @hookform/resolvers    # Resolver untuk react-hook-form + yup
```

### UI Components (Pilih salah satu atau kombinasi)
```bash
# Headless UI (tanpa styling, cocok dengan Tailwind)
npm install @headlessui/react

# Atau pakai component library siap pakai
npm install flowbite-react         # Tailwind components
# npm install @radix-ui/react-*    # Radix UI (headless, composable)
```

### Payment (Midtrans)
- Install Midtrans Snap di HTML atau gunakan script loader
- Setup di `src/services/paymentService.js`

### Dev Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint prettier eslint-config-prettier
npm install -D @vitejs/plugin-react
```

---

## 🎯 Penjelasan Singkat Tiap Folder

### 📄 `pages/`
Halaman lengkap aplikasi. Dibagi jelas:
- **user/**: Semua halaman yang diakses customer (booking, payment, riwayat)
- **admin/**: Semua halaman yang diakses admin (dashboard, kelola booking, laporan)

### 🧩 `components/`
Komponen reusable:
- **common/**: Dipakai baik user maupun admin (Button, Modal, Input)
- **user/**: Komponen spesifik fitur user (ScheduleGrid, PaymentButton)
- **admin/**: Komponen spesifik fitur admin (Sidebar, BookingTable)

### 🏗️ `layouts/`
Wrapper layout:
- **UserLayout**: Header + Footer untuk halaman user
- **AdminLayout**: Sidebar + Header untuk dashboard admin
- **AuthLayout**: Layout simple untuk login/register

### 🌐 `services/`
Semua komunikasi dengan backend (API calls):
- `api.js`: Config Axios (base URL, interceptors, token handling)
- `bookingService.js`: Create, read, update booking
- `paymentService.js`: Integrasi Midtrans Snap (client-side)

### 🪝 `hooks/`
Custom hooks untuk logic reusable:
- `useAuth`: Cek status login, role (user/admin), logout
- `useBooking`: Fetch & manage booking state
- `usePayment`: Handle Midtrans payment flow

### 🌍 `contexts/`
Global state dengan Context API:
- `AuthContext`: User data, login status, token
- Optional: `BookingContext` jika booking state kompleks (bisa pakai zustand/react-query)

### 🛠️ `utils/`
Helper functions:
- `formatters.js`: Format harga (Rp), tanggal (dd/MM/yyyy)
- `validators.js`: Validasi email, phone, form
- `constants.js`: Konstanta seperti BASE_URL, status enum

### 📋 `constants/`
Definisi routes, API endpoints, status:
```js
// routes.js
export const ROUTES = {
  USER: {
    HOME: '/',
    FACILITIES: '/facilities',
    BOOKING: '/booking',
    PAYMENT: '/payment/:id',
    MY_BOOKINGS: '/my-bookings'
  },
  ADMIN: {
    DASHBOARD: '/admin',
    BOOKINGS: '/admin/bookings',
    FACILITIES: '/admin/facilities'
  }
};
```

---

## 🚀 Setup & Run

1. Install dependencies:
```bash
cd fe
npm install
```

2. Buat file `.env`:
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

3. Run development server:
```bash
npm run dev
```

4. Build production:
```bash
npm run build
npm run preview
```

---

## 📱 Flow Booking (User)

1. **Home** → Lihat lapangan
2. **Facilities** → Pilih lapangan (futsal/bola)
3. **FacilityDetail** → Lihat jadwal & harga
4. **Booking** → Pilih waktu, isi form booking
5. **Payment** → Bayar via Midtrans Snap
6. **PaymentSuccess** → Konfirmasi & redirect ke My Bookings
7. **MyBookings** → Lihat riwayat booking

## 🛡️ Flow Admin

1. **Login** → Autentikasi admin
2. **Dashboard** → Lihat statistik (total booking, revenue)
3. **Bookings** → Lihat & kelola semua booking
4. **Facilities** → CRUD lapangan
5. **Schedule** → Set harga & jadwal per jam
6. **Payments** → Monitor pembayaran
7. **Reports** → Download laporan

---

## ✅ Best Practices

- Gunakan **React Router** dengan lazy loading untuk code splitting
- Implementasi **Protected Routes** (user & admin terpisah)
- Pakai **React Query** untuk caching & automatic refetch
- **Toast notifications** untuk feedback user
- **Loading states** & **error handling** di semua API calls
- **Responsive design** dengan Tailwind (mobile-first)
- **Form validation** dengan react-hook-form + yup
- **Environment variables** untuk API URL & Midtrans key

---

Struktur ini siap untuk production dan mudah di-maintain! 🎉
