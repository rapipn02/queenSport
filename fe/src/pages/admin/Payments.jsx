import React, { useState, useEffect } from 'react';
import { User, DoorOpen, Calendar, FileDown } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import bookingService from '../../services/bookingService';

const Payments = () => {
  const [dariTanggal, setDariTanggal] = useState('');
  const [sampaiTanggal, setSampaiTanggal] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      if (response.success) {
        // Filter only confirmed bookings (Dikonfirmasi)
        const confirmedBookings = response.data.filter(b => b.status === 'Dikonfirmasi');
        setPayments(confirmedBookings);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading payments:', error);
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return '-';
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  const filteredPayments = payments.filter(payment => {
    if (!dariTanggal && !sampaiTanggal) return true;
    const paymentDate = new Date(payment.created_at);
    const dari = dariTanggal ? new Date(dariTanggal) : null;
    const sampai = sampaiTanggal ? new Date(sampaiTanggal) : null;
    
    if (dari && sampai) {
      return paymentDate >= dari && paymentDate <= sampai;
    } else if (dari) {
      return paymentDate >= dari;
    } else if (sampai) {
      return paymentDate <= sampai;
    }
    return true;
  });

  // Filtered and sorted payments
  const displayPayments = filteredPayments;

  // OLD Sample data - now using API
  const oldPayments = [
    {
      id: 1,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 2,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 3,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 4,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 5,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 6,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 7,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 8,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 9,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 10,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 11,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 12,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 13,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 14,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 15,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 16,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 17,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 18,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 19,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    },
    {
      id: 20,
      waktu: '11-9-2025 18.35',
      nama: 'Faiz Ramadhan Suharida',
      noHp: '+62 80000000000',
      email: 'faiz@gmail.com',
      lapangan: 'Badminton A',
      tanggalBooking: '15-9-2025',
      jamBooking: '18.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'Lunas'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-lime-400">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto ml-64">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-700 text-lg mb-2">
              Welcome to <span className="font-semibold">QueenSportHall Managing System</span>, <span className="text-yellow-600 font-bold">Admin</span>
            </p>
            <h1 className="text-5xl font-bold text-gray-900">Laporan</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow">
              <User className="w-6 h-6" />
              <span className="font-semibold">Admin</span>
            </div>
            <button className="bg-white p-3 rounded-full shadow hover:shadow-lg transition-shadow">
              <DoorOpen className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Dari Tanggal */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Dari Tanggal</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={dariTanggal}
                  onChange={(e) => setDariTanggal(e.target.value)}
                  className="pl-4 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 w-48"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Sampai */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Sampai</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={sampaiTanggal}
                  onChange={(e) => setSampaiTanggal(e.target.value)}
                  className="pl-4 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 w-48"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Preview Button */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2 opacity-0">Action</label>
              <button className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold text-base hover:bg-green-600 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Preview
              </button>
            </div>

            {/* Export Button */}
            <div className="flex flex-col ml-auto">
              <label className="text-sm font-semibold text-gray-700 mb-2 opacity-0">Export</label>
              <button className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold text-base hover:bg-green-600 flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-100 border-b-2 border-gray-200">
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Waktu Booking</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Nama</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">No HP</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Lapangan</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Tanggal Booking</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Jam booking</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Harga DP</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Total Harga</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-600"></div>
                      <p className="mt-2">Loading...</p>
                    </td>
                  </tr>
                ) : displayPayments.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data pembayaran
                    </td>
                  </tr>
                ) : (
                  displayPayments.map((payment) => (
                    <tr key={payment.id_booking} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(payment.created_at)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{payment.nama}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{payment.no_telepon}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{payment.email || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{payment.nama_lapangan}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(payment.tanggal)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatTime(payment.jam_mulai)} - {formatTime(payment.jam_selesai)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatRupiah(payment.harga_dp || (payment.total_harga * 0.5))}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatRupiah(payment.total_harga)}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-green-700">
                          Lunas
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Showing {displayPayments.length} of {payments.length} List</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Prev
              </button>
              <button className="w-10 h-10 rounded-lg bg-green-500 text-white font-bold">
                1
              </button>
              <button className="w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">
                2
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payments;
