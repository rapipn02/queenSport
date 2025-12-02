import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    // Try to get booking data from navigation state first (most secure)
    let bookingData = location.state?.bookingData;
    
    if (!bookingData) {
      // Fallback to localStorage
      const storedData = localStorage.getItem('lastBookingData');
      if (storedData) {
        try {
          bookingData = JSON.parse(storedData);
          console.log('Loaded booking data from localStorage:', bookingData);
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
      }
    }
    
    if (bookingData) {
      console.log('Invoice data loaded:', bookingData);
      setInvoiceData(bookingData);
      // Clean up localStorage after successfully loading
      localStorage.removeItem('lastBookingData');
      localStorage.removeItem('lastPaymentResult');
    } else {
      console.warn('No booking data available');
      alert('Data pembayaran tidak ditemukan. Silakan cek di My Bookings.');
      navigate('/');
    }
  }, [location, navigate]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    // Handle different date formats
    let date;
    if (dateString.includes('-')) {
      // Format: YYYY-MM-DD
      date = new Date(dateString + 'T00:00:00');
    } else if (dateString.includes(',')) {
      // Already formatted
      return dateString;
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return dateString;
    }
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

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

  if (!invoiceData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-green-500"></div>
          <p className="mt-4 text-white">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* === BAGIAN HITAM (BACKGROUND & STARS) === */}
      <div className="relative h-[25vh] bg-black text-white overflow-hidden">
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

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[25vh] px-4">
          {/* Success Animation */}
          <div className="mb-4 relative">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-orbitron tracking-tight mb-2">
            PEMBAYARAN BERHASIL
          </h1>
          <p className="text-green-400 text-lg font-semibold">Booking Anda telah dikonfirmasi!</p>
        </div>
      </div>

      {/* === BAGIAN PUTIH (INVOICE) === */}
      <div className="w-full min-h-[75vh] bg-white rounded-t-[3rem] -mt-8 shadow-2xl pb-10">
        <div className="max-w-3xl mx-auto px-6 md:px-12 pt-12">
          
          {/* Invoice Header */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
                <p className="text-green-100 text-sm">Queensport Hall</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80 mb-1">Booking ID</p>
                <p className="text-2xl font-bold">#{invoiceData.id_booking}</p>
              </div>
            </div>

            <div className="border-t border-green-400/30 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-100 mb-1">Tanggal Booking</p>
                  <p className="font-semibold">{formatDate(invoiceData.tanggal_booking || invoiceData.tanggal_raw || invoiceData.tanggal)}</p>
                </div>
                <div>
                  <p className="text-green-100 mb-1">Status</p>
                  <div className="inline-block bg-white/20 px-3 py-1 rounded-full">
                    <p className="font-bold text-sm">✓ DIKONFIRMASI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informasi Pemesan
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Nama</p>
                <p className="font-semibold text-gray-900">{invoiceData.nama}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">No. Telepon</p>
                <p className="font-semibold text-gray-900">{invoiceData.noHP}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{invoiceData.email}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Detail Booking
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Lapangan</span>
                <span className="font-bold text-gray-900 text-lg">{invoiceData.lapangan}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Tanggal</span>
                <span className="font-semibold text-gray-900">{formatDate(invoiceData.tanggal_booking || invoiceData.tanggal)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Jam</span>
                <span className="font-semibold text-gray-900">{invoiceData.jam}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Durasi</span>
                <span className="font-semibold text-gray-900">{invoiceData.durasi} jam</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white mb-6">
            <h3 className="text-lg font-bold mb-4">Ringkasan Pembayaran</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Harga</span>
                <span className="font-semibold">{formatRupiah(invoiceData.totalHarga)}</span>
              </div>
              
              {invoiceData.metode_pembayaran === 'DP' && (
                <>
                  <div className="flex justify-between items-center text-green-400">
                    <span>DP Dibayar (50%)</span>
                    <span className="font-bold">{formatRupiah(invoiceData.hargaDP)}</span>
                  </div>
                  <div className="flex justify-between items-center text-yellow-400">
                    <span>Sisa Pembayaran</span>
                    <span className="font-bold">{formatRupiah(invoiceData.totalHarga - invoiceData.hargaDP)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-600 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total Dibayar</span>
                <span className="text-2xl font-bold text-green-400">
                  {formatRupiah(invoiceData.metode_pembayaran === 'DP' ? invoiceData.hargaDP : invoiceData.totalHarga)}
                </span>
              </div>
            </div>
          </div>

          

          {/* Note */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-900">
              <strong>Catatan:</strong> {invoiceData.metode_pembayaran === 'DP' 
                ? 'Sisa pembayaran dapat dilakukan di tempat pada hari booking.' 
                : 'Pembayaran Anda telah lunas. Terima kasih!'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
