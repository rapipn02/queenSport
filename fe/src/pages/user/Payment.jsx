import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { snapToken, bookingId, total, bookingData } = location.state || {};

  useEffect(() => {
    // Check if snap token exists
    if (!snapToken) {
      const savedToken = localStorage.getItem('snapToken');
      if (!savedToken) {
        alert('Token pembayaran tidak ditemukan');
        navigate('/booking');
        return;
      }
    }

    // Load Midtrans Snap if not already loaded
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'YOUR_CLIENT_KEY');
    
    if (!document.querySelector('script[src*="snap.js"]')) {
      document.head.appendChild(script);
    }
  }, [snapToken, navigate]);

  const handlePayment = () => {
    const token = snapToken || localStorage.getItem('snapToken');
    
    if (!token) {
      alert('Token pembayaran tidak valid');
      return;
    }

    if (!window.snap) {
      alert('Midtrans Snap belum siap. Silakan tunggu sebentar dan coba lagi.');
      return;
    }

    setLoading(true);

    // Open Midtrans Snap popup
    window.snap.pay(token, {
      onSuccess: function(result) {
        console.log('Payment success:', result);
        alert('Pembayaran berhasil!');
        // Clear localStorage
        localStorage.removeItem('snapToken');
        localStorage.removeItem('bookingId');
        localStorage.removeItem('bookingUserData');
        // Navigate to booking detail or success page
        navigate('/my-bookings');
      },
      onPending: function(result) {
        console.log('Payment pending:', result);
        alert('Pembayaran menunggu. Silakan selesaikan pembayaran Anda.');
        navigate('/my-bookings');
      },
      onError: function(result) {
        console.log('Payment error:', result);
        alert('Pembayaran gagal. Silakan coba lagi.');
        setLoading(false);
      },
      onClose: function() {
        console.log('Payment popup closed');
        alert('Anda menutup popup pembayaran');
        setLoading(false);
      }
    });
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Pembayaran</h1>
          
          {/* Booking Details */}
          {bookingData && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Detail Booking</h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">ID Booking:</span> {bookingData.id_booking}</p>
                <p><span className="font-medium">Nama:</span> {bookingData.nama}</p>
                <p><span className="font-medium">No. Telepon:</span> {bookingData.no_telepon}</p>
                <p><span className="font-medium">Email:</span> {bookingData.email}</p>
                <p><span className="font-medium">Status:</span> <span className="text-yellow-600">{bookingData.status_booking}</span></p>
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className="mb-8 p-6 bg-green-50 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total Pembayaran (DP 50%)</span>
              <span className="text-2xl font-bold text-green-600">
                {formatRupiah(total ? total * 0.5 : 0)}
              </span>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl 
                      transition-all duration-300 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Bayar Sekarang'}
          </button>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Anda akan diarahkan ke halaman pembayaran Midtrans yang aman
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
