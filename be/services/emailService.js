const transporter = require('../config/email');

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
};

const formatDate = (date) => {
  const d = new Date(date);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const sendInvoiceEmail = async (bookingData) => {
  const { 
    id_booking, 
    nama, 
    email, 
    no_telepon,
    nama_lapangan,
    jenis,
    tanggal,
    jam_mulai,
    jam_selesai,
    total_harga,
    harga_dp,
    metode_pembayaran
  } = bookingData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Invoice Pembayaran - Booking #${id_booking} - QueenSportHall`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #00800F 0%, #00A814 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
          }
          .invoice-box {
            background: white;
            padding: 30px;
            border: 1px solid #ddd;
          }
          .invoice-header {
            background: #00800F;
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .invoice-id {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .status {
            background: #4CAF50;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            display: inline-block;
            margin-top: 10px;
          }
          .section {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
          }
          .section-title {
            font-weight: bold;
            color: #00800F;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .info-label {
            color: #666;
          }
          .info-value {
            font-weight: bold;
            text-align: right;
          }
          .payment-summary {
            background: #1a1a1a;
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .payment-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
          }
          .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #00800F;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✓ PEMBAYARAN BERHASIL</h1>
          <p>Booking Anda telah dikonfirmasi!</p>
        </div>
        
        <div class="invoice-box">
          <div class="invoice-header">
            <p class="invoice-id">INVOICE</p>
            <p style="margin: 5px 0;">Queensport Hall</p>
            <p style="margin: 5px 0;">Booking ID #${id_booking}</p>
            <span class="status">✓ DIKONFIRMASI</span>
          </div>

          <div class="section">
            <div class="section-title">👤 Informasi Pemesan</div>
            <div class="info-row">
              <span class="info-label">Nama</span>
              <span class="info-value">${nama}</span>
            </div>
            <div class="info-row">
              <span class="info-label">No. Telepon</span>
              <span class="info-value">${no_telepon}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">${email}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">🏟️ Detail Booking</div>
            <div class="info-row">
              <span class="info-label">Lapangan</span>
              <span class="info-value">${nama_lapangan} (${jenis})</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tanggal</span>
              <span class="info-value">${formatDate(tanggal)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Jam</span>
              <span class="info-value">${jam_mulai.substring(0,5)} - ${jam_selesai.substring(0,5)}</span>
            </div>
          </div>

          <div class="payment-summary">
            <div class="payment-row">
              <span>Total Harga</span>
              <span class="total-amount">${formatRupiah(total_harga)}</span>
            </div>
            ${metode_pembayaran === 'DP' ? `
            <div class="payment-row" style="border-top: 1px solid #333; padding-top: 10px;">
              <span>DP (50%)</span>
              <span style="color: #4CAF50; font-weight: bold;">${formatRupiah(harga_dp)}</span>
            </div>
            <div class="payment-row">
              <span>Sisa Pembayaran</span>
              <span style="color: #FFC107;">${formatRupiah(total_harga - harga_dp)}</span>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
              * Sisa pembayaran dibayarkan saat kedatangan
            </p>
            ` : `
            <div class="payment-row" style="border-top: 1px solid #333; padding-top: 10px;">
              <span>Status Pembayaran</span>
              <span style="color: #4CAF50; font-weight: bold;">LUNAS</span>
            </div>
            `}
          </div>

          <div style="text-align: center;">
            <a href="http://localhost:3000/my-bookings" class="button">
              Lihat Booking Saya
            </a>
          </div>
        </div>

        <div class="footer">
          <p>Terima kasih telah menggunakan layanan QueenSportHall!</p>
          <p>Jika ada pertanyaan, silakan hubungi kami.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            Email ini dikirim otomatis, mohon tidak membalas email ini.
          </p>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Invoice email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('✗ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendInvoiceEmail };