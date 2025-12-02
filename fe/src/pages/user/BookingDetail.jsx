import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../../services/bookingService';

const BookingDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from navigation state
    if (location.state?.bookingData && location.state?.facilityData) {
      const { bookingData: booking, facilityData, snapToken, selectedTimes } = location.state;
      console.log('BookingDetail received:', location.state);
      
      try {
        // Format jam dari selectedTimes
        const jamStr = selectedTimes && selectedTimes.length > 0 
          ? `${selectedTimes[0]} - ${selectedTimes[selectedTimes.length - 1].replace('.00', '.59')}`
          : '-';

        const formattedDate = formatDate(booking.tanggal_booking);
        console.log('Formatted date:', formattedDate);

        setBookingData({
          id_booking: booking.id_booking,
          nama: booking.nama,
          noHP: booking.no_telepon,
          email: booking.email || '-',
          lapangan: facilityData.nama_lapangan,
          tanggal: formattedDate,
          tanggal_raw: booking.tanggal_booking, // Keep raw date for reference
          jam: jamStr,
          durasi: booking.durasi_jam || 1,
          totalHarga: parseFloat(booking.total_harga) || 0,
          hargaDP: (parseFloat(booking.total_harga) || 0) * 0.5,
          snapToken: snapToken,
          metode_pembayaran: booking.metode_pembayaran || 'DP'
        });
        setLoading(false);
      } catch (error) {
        console.error('Error processing booking data:', error);
        console.error('Booking data:', booking);
        alert('Error memuat data booking. Kembali ke halaman booking.');
        navigate('/booking-schedule');
      }
    } else {
      // Redirect if no data
      console.warn('No booking data found, redirecting...');
      navigate('/booking-schedule');
    }
  }, [location, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (jam_mulai, jam_selesai) => {
    if (!jam_mulai || !jam_selesai) return '-';
    return `${jam_mulai.substring(0, 5)} - ${jam_selesai.substring(0, 5)}`;
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // Cahaya & stars
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

  const handleBayar = () => {
    if (!bookingData || !bookingData.snapToken) {
      alert('Token pembayaran tidak ditemukan!');
      return;
    }

    // Prepare invoice data for payment success page
    const invoiceData = {
      id_booking: bookingData.id_booking,
      nama: bookingData.nama,
      noHP: bookingData.noHP,
      email: bookingData.email,
      lapangan: bookingData.lapangan,
      tanggal_booking: bookingData.tanggal_raw || bookingData.tanggal,
      tanggal: bookingData.tanggal,
      jam: bookingData.jam,
      durasi: bookingData.durasi,
      totalHarga: bookingData.totalHarga,
      hargaDP: bookingData.hargaDP,
      metode_pembayaran: bookingData.metode_pembayaran
    };

    // Save to localStorage before payment
    localStorage.setItem('lastBookingData', JSON.stringify(invoiceData));
    console.log('Saved invoice data to localStorage:', invoiceData);

    // Check if script already loaded
    const existingScript = document.querySelector('script[src*="snap.js"]');
    if (existingScript) {
      // Script already loaded, just call snap.pay
      window.snap.pay(bookingData.snapToken, {
        onSuccess: async function(result) {
          console.log('Payment success:', result);
          
          // Update payment status in backend
          try {
            await bookingService.updatePaymentStatus({
              order_id: result.order_id,
              transaction_status: result.transaction_status
            });
            console.log('Payment status updated successfully');
          } catch (error) {
            console.error('Error updating payment status:', error);
          }
          
          // Redirect to invoice page
          navigate('/payment-success', { state: { bookingData: invoiceData } });
        },
        onPending: function(result) {
          console.log('Payment pending:', result);
          alert('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.');
        },
        onError: function(result) {
          console.log('Payment error:', result);
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: function() {
          console.log('Payment popup closed');
        }
      });
      return;
    }

    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'SB-Mid-client-BJIR2i1bWQNjYCA_');
    script.onload = () => {
      // Open Midtrans Snap popup
      window.snap.pay(bookingData.snapToken, {
        onSuccess: async function(result) {
          console.log('Payment success:', result);
          
          // Update payment status in backend
          try {
            await bookingService.updatePaymentStatus({
              order_id: result.order_id,
              transaction_status: result.transaction_status
            });
            console.log('Payment status updated successfully');
          } catch (error) {
            console.error('Error updating payment status:', error);
          }
          
          // Redirect to invoice page with data
          navigate('/payment-success', { state: { bookingData: invoiceData } });
        },
        onPending: function(result) {
          console.log('Payment pending:', result);
          alert('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.');
        },
        onError: function(result) {
          console.log('Payment error:', result);
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: function() {
          console.log('Payment popup closed');
        }
      });
    };
    document.body.appendChild(script);
  };

  if (loading || !bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-green-500"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* === BAGIAN HITAM (BACKGROUND & STARS & CAHAYA) === */}
      <div className="relative h-[20vh] bg-black text-white overflow-hidden">
        {/* Cahaya Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] 
                          bg-gradient-radial from-white/50 via-white/85 to-transparent 
                          rounded-full blur-[190px] opacity-100"></div>
        </div>
        
        {/* Stars */}
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
              zIndex: 1,
            }}
          />
        ))}

        <Link
          to="/booking-schedule"
          className="absolute top-6 left-6 z-20 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all hover:shadow-lg"
        >
          ← Back
        </Link>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[20vh] px-4 pt-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Open 07.00 - 20.00</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-orbitron tracking-tight">
            BOOKING
          </h1>
        </div>
      </div>

      {/* === BAGIAN PUTIH DETAIL === */}
      <div className="w-full min-h-[90vh] bg-white rounded-t-[3rem] -mt-8 shadow-2xl pb-32">
        <div className="max-w-xl mx-auto px-6 pt-10">
          {/* Invoice Header with Booking ID */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium opacity-80 mb-1">Booking ID</p>
                <p className="text-2xl font-bold">#{bookingData.id_booking}</p>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400">
                <p className="text-sm font-bold text-green-400">Menunggu Pembayaran</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-8">
            Detail pemesanan
          </h2>

          {/* Form-like Display */}
          <div className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nama
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
                {bookingData.nama}
              </div>
            </div>

            {/* No. HP */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                No. HP
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
                {bookingData.noHP}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
                {bookingData.email}
              </div>
            </div>

            {/* Detail Booking */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Detail Booking
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-700 space-y-1">
                <div className="font-semibold">{bookingData.lapangan}</div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {bookingData.tanggal}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {bookingData.jam} ({bookingData.durasi} jam)
                </div>
              </div>
            </div>

            {/* Total Harga */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-100 rounded-lg">
              <span className="font-semibold text-gray-900">Total Harga</span>
              <span className="font-bold text-gray-900">{formatRupiah(bookingData.totalHarga)}</span>
            </div>

            {/* Harga DP 50% */}
            {bookingData.metode_pembayaran === 'DP' && (
              <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-500">
                <span className="font-semibold text-green-900">Harga DP 50%</span>
                <span className="font-bold text-green-900 text-lg">{formatRupiah(bookingData.hargaDP)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fixed Bar */}
      <div className="fixed bottom-12 left-0 right-0 text-white py-2 px-8 flex items-center justify-center z-50 shadow-2xl bg-black/80 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_2%,rgba(0,0,0,1)_50%,rgba(102,102,102,1)_100%)]">
        <div className="text-lg font-bold justify-center">
          <span className="font-semibold text-base">
            {bookingData.metode_pembayaran === 'DP' ? 'Harga DP' : 'Total Harga'}
          </span>
          <span className="font-bold text-xl">
            {' '}{formatRupiah(bookingData.metode_pembayaran === 'DP' ? bookingData.hargaDP : bookingData.totalHarga)}
          </span>
        </div>
      </div>

      {/* Bayar Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#00800F] text-white py-0 px-8 flex items-center justify-center z-60 shadow-2xl">
        <button
          onClick={handleBayar}
          className="w-full py-4 text-white font-bold text-lg transition-all hover:bg-[#006b0d]"
        >
          BAYAR SEKARANG
        </button>
      </div>
    </>
  );
};

export default BookingDetail;