import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // Get user data from localStorage
      const userData = localStorage.getItem('bookingUserData');
      if (!userData) {
        // Jika tidak ada data user, ambil semua booking (untuk demo)
        const response = await bookingService.getAllBookings();
        if (response.success) {
          setBookings(response.data);
        }
      } else {
        const user = JSON.parse(userData);
        // Get bookings by user phone or email
        const response = await bookingService.getBookingsByUser(user.noHP || user.email);
        if (response.success) {
          setBookings(response.data);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading bookings:', error);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (jam_mulai, jam_selesai) => {
    if (!jam_mulai || !jam_selesai) return '-';
    return `${jam_mulai.substring(0, 5)} - ${jam_selesai.substring(0, 5)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Dikonfirmasi':
        return 'bg-green-500';
      case 'Menunggu':
        return 'bg-yellow-400';
      case 'Dibatalkan':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBgCard = (status) => {
    switch (status) {
      case 'Dikonfirmasi':
        return 'from-green-500 to-green-600';
      case 'Menunggu':
        return 'from-yellow-400 to-yellow-500';
      case 'Dibatalkan':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'Menunggu';
    if (filter === 'confirmed') return booking.status === 'Dikonfirmasi';
    if (filter === 'cancelled') return booking.status === 'Dibatalkan';
    return true;
  });

  const generateStars = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      animationDelay: `${Math.random() * 3}s`,
      opacity: Math.random() * 0.5 + 0.3
    }));
  };

  const stars = generateStars(50);

  return (
    <>
      {/* === BAGIAN HITAM (BACKGROUND & STARS) === */}
      <div className="relative h-[20vh] bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] 
                          bg-gradient-radial from-white/50 via-white/85 to-transparent 
                          rounded-full blur-[190px] opacity-100"></div>

        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: star.animationDelay,
              animationDuration: '3s',
            }}
          />
        ))}

        <Link
          to="/"
          className="absolute top-6 left-6 z-20 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all hover:shadow-lg"
        >
          ← Back
        </Link>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[20vh] px-4">
          <div className="flex items-center gap-2 px-6 py-3 mt-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Open 07.00 - 20.00</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-orbitron tracking-tight mb-9">
            MY BOOKINGS
          </h1>
        </div>
      </div>

      {/* === BAGIAN PUTIH (CONTENT) === */}
      <div className="w-full min-h-[75vh] bg-white rounded-t-[3rem] -mt-8 shadow-2xl pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
          
          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Semua ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Menunggu ({bookings.filter(b => b.status === 'Menunggu').length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === 'confirmed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Dikonfirmasi ({bookings.filter(b => b.status === 'Dikonfirmasi').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Dibatalkan ({bookings.filter(b => b.status === 'Dibatalkan').length})
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Belum ada booking</h3>
              <p className="mt-2 text-gray-600">Mulai booking lapangan favorit Anda sekarang!</p>
              <Link
                to="/booking"
                className="mt-6 inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all"
              >
                Booking Sekarang
              </Link>
            </div>
          )}

          {/* Booking Cards */}
          {!loading && filteredBookings.length > 0 && (
            <div className="space-y-6 max-w-md mx-auto">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id_booking}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Header dengan gradient sesuai status */}
                  <div className={`bg-gradient-to-r ${getStatusBgCard(booking.status)} p-4 text-white flex justify-between items-center`}>
                    <div>
                      <p className="text-xs font-medium opacity-90">Booking ID</p>
                      <p className="text-xl font-bold">#{booking.id_booking}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                      <p className="text-sm font-bold">{booking.status}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Facility Info dengan icon */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`${booking.status === 'Menunggu' ? 'bg-yellow-50' : 'bg-green-50'} p-2.5 rounded-lg`}>
                        <svg className={`w-5 h-5 ${booking.status === 'Menunggu' ? 'text-yellow-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{booking.nama_lapangan || 'Lapangan'}</p>
                        <p className="text-sm text-gray-600">{booking.jenis || 'Badminton'}</p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2.5 text-sm mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Nama</span>
                        <span className="font-bold text-gray-900">{booking.nama}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tanggal</span>
                        <span className="font-semibold text-gray-900">{formatDate(booking.tanggal_booking)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Jam</span>
                        <span className="font-semibold text-gray-900">{formatTime(booking.jam_mulai, booking.jam_selesai)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Durasi</span>
                        <span className="font-semibold text-gray-900">{booking.durasi_jam} jam</span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="bg-gray-900 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">Total Harga</span>
                        <span className="text-white font-bold text-lg">{formatRupiah(booking.total_harga)}</span>
                      </div>
                      {booking.status === 'Menunggu' && (
                        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                          <span className="text-green-400 text-sm font-medium">DP (50%)</span>
                          <span className="text-green-400 font-bold text-lg">{formatRupiah(booking.total_harga * 0.5)}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>📞</span>
                        <span>{booking.no_telepon}</span>
                      </div>
                      {booking.email && (
                        <div className="flex items-center gap-1">
                          <span>✉️</span>
                          <span>{booking.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;
