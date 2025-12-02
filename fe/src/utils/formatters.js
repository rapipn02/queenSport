// Format harga ke Rupiah
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format tanggal
export const formatDate = (date, format = 'dd/MM/yyyy') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  if (format === 'dd/MM/yyyy') {
    return `${day}/${month}/${year}`;
  }
  if (format === 'yyyy-MM-dd') {
    return `${year}-${month}-${day}`;
  }
  return d.toLocaleDateString('id-ID');
};

// Format waktu
export const formatTime = (time) => {
  return time.substring(0, 5); // HH:mm
};

// Format status booking
export const formatBookingStatus = (status) => {
  const statusMap = {
    pending: 'Menunggu Pembayaran',
    confirmed: 'Dikonfirmasi',
    cancelled: 'Dibatalkan',
    completed: 'Selesai',
  };
  return statusMap[status] || status;
};

// Format payment status
export const formatPaymentStatus = (status) => {
  const statusMap = {
    pending: 'Menunggu',
    success: 'Berhasil',
    failed: 'Gagal',
    expired: 'Kadaluarsa',
  };
  return statusMap[status] || status;
};
