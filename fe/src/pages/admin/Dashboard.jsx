import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Grid3x3, FileText, LogOut, User, DoorOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';
import bookingService from '../../services/bookingService';
import { getAllFacilities } from '../../services/facilityService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  
  // State untuk data dari API
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyBookings: 0,
    todayBookings: 0,
    dpBookings: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Load data dari API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load bookings
      const bookingsResponse = await bookingService.getAllBookings();
      if (bookingsResponse.success) {
        const bookingsData = bookingsResponse.data;
        setBookings(bookingsData);
        
        // Calculate stats
        calculateStats(bookingsData);
        calculateWeeklyData(bookingsData);
        calculateMonthlyData(bookingsData);
      }
      
      // Load facilities
      const facilitiesResponse = await getAllFacilities();
      if (facilitiesResponse.success) {
        setFacilities(facilitiesResponse.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    let totalRevenue = 0;
    let monthlyBookings = 0;
    let todayBookings = 0;
    let dpBookings = 0;
    
    bookingsData.forEach(booking => {
      const bookingDate = new Date(booking.tanggal_booking);
      const revenue = parseFloat(booking.total_harga) || 0;
      
      // Total revenue bulan ini
      if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
        totalRevenue += revenue;
        monthlyBookings++;
      }
      
      // Booking hari ini
      if (booking.tanggal_booking === today) {
        todayBookings++;
      }
      
      // Status DP (Menunggu)
      if (booking.status === 'Menunggu') {
        dpBookings++;
      }
    });
    
    setStats({
      totalRevenue,
      monthlyBookings,
      todayBookings,
      dpBookings
    });
  };

  const calculateWeeklyData = (bookingsData) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const weekData = days.map(day => ({ day, bookings: 0 }));
    
    bookingsData.forEach(booking => {
      const bookingDate = new Date(booking.tanggal_booking);
      const dayIndex = bookingDate.getDay();
      weekData[dayIndex].bookings++;
    });
    
    setWeeklyData(weekData);
  };

  const calculateMonthlyData = (bookingsData) => {
    const weeks = [1, 2, 3, 4].map(week => ({ week, bookings: 0 }));
    
    bookingsData.forEach(booking => {
      const bookingDate = new Date(booking.tanggal_booking);
      const dayOfMonth = bookingDate.getDate();
      const weekIndex = Math.min(Math.floor((dayOfMonth - 1) / 7), 3);
      weeks[weekIndex].bookings++;
    });
    
    setMonthlyData(weeks);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (jam_mulai, jam_selesai) => {
    if (!jam_mulai || !jam_selesai) return '-';
    return `${jam_mulai.substring(0, 5)} - ${jam_selesai.substring(0, 5)}`;
  };

  // Time slots dengan status
  const timeSlots = [
    { time: '07.00', status: 'booked' },
    { time: '08.00', status: 'booked' },
    { time: '09.00', status: 'available' },
    { time: '10.00', status: 'available' },
    { time: '11.00', status: 'available' },
    { time: '12.00', status: 'available' },
    { time: '13.00', status: 'available' },
    { time: '14.00', status: 'available' },
    { time: '15.00', status: 'available' },
    { time: '16.00', status: 'booked' },
    { time: '17.00', status: 'booked' },
    { time: '18.00', status: 'available' },
    { time: '19.00', status: 'active' },
    { time: '20.00', status: 'available' },
    { time: '21.00', status: 'available' },
    { time: '22.00', status: 'available' },
  ];

  // Dates untuk monitoring
  const dates = [
    { date: 8, day: 'Senin' },
    { date: 9, day: 'Senin' },
    { date: 10, day: 'Senin' },
    { date: 11, day: 'Senin' },
    { date: 12, day: 'Senin' },
    { date: 13, day: 'Senin' },
    { date: 14, day: 'Senin' },
  ];

      const bookingsData = [
    {
      id: 1,
      waktu: '11-9-2025 18:35',
      nama: 'Faiz Ramadhan Suhanda',
      noHP: '+62 80000000000',
      email: 'faiz@gamil.com',
      lapangan: 'Badminton A',
      tanggal: '15-9-2025',
      jam: '16.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'pending'
    },
    {
      id: 2,
      waktu: '11-9-2025 18:35',
      nama: 'Faiz Ramadhan Suhanda',
      noHP: '+62 80000000000',
      email: 'faiz@gamil.com',
      lapangan: 'Badminton A',
      tanggal: '15-9-2025',
      jam: '16.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'pending'
    },
    {
      id: 3,
      waktu: '11-9-2025 18:35',
      nama: 'Faiz Ramadhan Suhanda',
      noHP: '+62 80000000000',
      email: 'faiz@gamil.com',
      lapangan: 'Badminton A',
      tanggal: '15-9-2025',
      jam: '16.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'pending'
    },
    {
      id: 4,
      waktu: '11-9-2025 18:35',
      nama: 'Faiz Ramadhan Suhanda',
      noHP: '+62 80000000000',
      email: 'faiz@gamil.com',
      lapangan: 'Badminton A',
      tanggal: '15-9-2025',
      jam: '16.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'pending'
    },
    {
      id: 5,
      waktu: '11-9-2025 18:35',
      nama: 'Faiz Ramadhan Suhanda',
      noHP: '+62 80000000000',
      email: 'faiz@gamil.com',
      lapangan: 'Badminton A',
      tanggal: '15-9-2025',
      jam: '16.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'pending'
    },
    {
      id: 6,
      waktu: '11-9-2025 18:35',
      nama: 'Faiz Ramadhan Suhanda',
      noHP: '+62 80000000000',
      email: 'faiz@gamil.com',
      lapangan: 'Badminton A',
      tanggal: '15-9-2025',
      jam: '16.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'pending'
    },
    {
      id: 7,
      waktu: '11-9-2025 18:35',
      nama: 'Faiz Ramadhan Suhanda',
      noHP: '+62 80000000000',
      email: 'faiz@gamil.com',
      lapangan: 'Badminton A',
      tanggal: '15-9-2025',
      jam: '16.00 - 18.00',
      hargaDP: 'Rp45.000',
      totalHarga: 'Rp90.000',
      status: 'pending'
    },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-200 via-yellow-100 to-lime-400">
      {/* Sidebar Component */}

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
            <h1 className="text-5xl font-bold text-gray-900">Dashboard</h1>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Pendapatan */}
          <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pendapatan Bulan ini</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {loading ? 'Loading...' : formatRupiah(stats.totalRevenue)}
            </p>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500 rounded-tl-full opacity-80"></div>
          </div>

          {/* Card 2 - Booking Bulan ini */}
          <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Booking Bulan ini</h3>
            <p className="text-6xl font-bold text-gray-900">
              {loading ? '...' : stats.monthlyBookings}
            </p>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-orange-500 rounded-tl-full opacity-80"></div>
          </div>

          {/* Card 3 - Booking Hari ini */}
          <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Booking Hari ini</h3>
            <p className="text-6xl font-bold text-gray-900">
              {loading ? '...' : stats.todayBookings}
            </p>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-400 rounded-tl-full opacity-80"></div>
          </div>

          {/* Card 4 - Status DP */}
          <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Status DP (Menunggu)</h3>
            <p className="text-6xl font-bold text-gray-900">
              {loading ? '...' : stats.dpBookings}
            </p>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-lime-500 rounded-tl-full opacity-80"></div>
          </div>
        </div>
{/* Charts & Monitoring Row */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
  {/* Left Column - Charts */}
  <div className="space-y-6">
    {/* Grafik Booking Mingguan */}
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Grafik Booking Mingguan</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={weeklyData}>
          
          {/* GRID GARIS SOLID KE DALAM CHART */}
          <CartesianGrid 
            stroke="#000000"
            strokeWidth={1.5}
            strokeDasharray="0"
            horizontal={true}
            vertical={false}
          />

          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />

          <Bar 
            dataKey="bookings" 
            fill="#000000" 
            radius={[20, 20, 20, 20]} 
          />
        </BarChart>
      </ResponsiveContainer>

    </div>

    {/* Grafik Booking Bulanan */}
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Grafik Booking Bulanan</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="bookings" stroke="#000000" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Right Column - Monitoring Jadwal */}
  <div className="bg-white rounded-3xl p-6 shadow-lg">
    <h3 className="text-xl font-bold text-gray-900 mb-6 text-left">Monitoring Jadwal</h3>

    {/* Dropdown Pilih Lapangan */}
    <div className="mb-6">
      <select
        value={selectedFacility}
        onChange={(e) => setSelectedFacility(e.target.value)}
    className="w-2/3 px-3 py-2 bg-white border-2 border-gray-900 rounded-full text-gray-900 font-medium cursor-pointer focus:outline-none text-left"
      >
        <option value="">Pilih Lapangan</option>
        {facilities.map(facility => (
          <option key={facility.id_lapangan} value={facility.id_lapangan}>
            {facility.nama_lapangan} - {facility.jenis}
          </option>
        ))}
      </select>
    </div>

    {/* Date Selection */}
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
      {dates.map((d) => (
        <button
          key={d.date}
          onClick={() => setSelectedDate(d.date)}
          className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl transition-all ${
            selectedDate === d.date
              ? 'bg-gray-900 text-white'
              : 'bg-gray-10 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="text-xs font-medium">{d.day}</span>
          <span className="text-2xl font-bold">{d.date}</span>
        </button>
      ))}
    </div>

    {/* Time Slots */}
    <div className="grid grid-cols-4 gap-5">
      {timeSlots.map((slot, index) => (
        <button
          key={index}
          disabled={slot.status === 'booked'}
          className={`px-4 py-3 rounded-full text-sm font-bold transition-all ${
            slot.status === 'booked'
              ? 'bg-[#FF6B6B] text-white cursor-not-allowed'
              : slot.status === 'active'
              ? 'bg-[#DFFF00] text-gray-900'
              : 'bg-white border-2 border-gray-900 text-gray-900 hover:border-green-500'
          }`}
        >
          {slot.time}
        </button>
      ))}
    </div>
  </div>
</div>
 {/* Tabel Booking Terbaru */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Tabel Booking Terbaru</h3>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Waktu Booking</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">No.HP</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Lapangan</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Tanggal Booking</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Jam booking</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Harga DP</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Total Harga</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      Belum ada data booking
                    </td>
                  </tr>
                ) : (
                  bookings.slice(0, 7).map((booking) => (
                    <tr key={booking.id_booking} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {new Date(booking.created_at || booking.tanggal_booking).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{booking.nama}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{booking.no_telepon}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{booking.email || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{booking.nama_lapangan || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{formatDate(booking.tanggal_booking)}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{formatTime(booking.jam_mulai, booking.jam_selesai)}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{formatRupiah(booking.total_harga * 0.5)}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{formatRupiah(booking.total_harga)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'Dikonfirmasi' ? 'bg-green-100 text-green-700' :
                            booking.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {Math.min(7, bookings.length)} of {bookings.length} bookings
            </p>
            <div className="flex items-center gap-2">
              <Link to="/admin/bookings" className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 underline">
                Lihat Semua Booking →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;