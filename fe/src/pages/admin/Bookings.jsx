import React, { useState, useEffect } from 'react';
import { User, DoorOpen, ChevronDown } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAllFacilities } from '../../services/facilityService';
import bookingService from '../../services/bookingService';
import availabilityService from '../../services/availabilityService';

const Bookings = () => {
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month
  const [showTambahBooking, setShowTambahBooking] = useState(false);
  const [showDetailBooking, setShowDetailBooking] = useState(false);
  const [showEditBooking, setShowEditBooking] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [statusPembayaran, setStatusPembayaran] = useState('DP');
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityData, setSelectedFacilityData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    nama: '',
    noHP: '',
    email: ''
  });

  // Load facilities and bookings
  useEffect(() => {
    loadFacilities();
    loadBookings();
  }, []);

  const loadFacilities = async () => {
    try {
      const response = await getAllFacilities();
      if (response.success) {
        // Filter only available facilities
        const available = response.data.filter(f => f.status === 'Tersedia');
        setFacilities(available);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      if (response.success) {
        setBookings(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setLoading(false);
    }
  };

  // Update selected facility data when facility changes
  useEffect(() => {
    if (selectedFacility) {
      const facility = facilities.find(f => f.id_lapangan === parseInt(selectedFacility));
      setSelectedFacilityData(facility);
    } else {
      setSelectedFacilityData(null);
    }
  }, [selectedFacility, facilities]);

  // Load availability when facility and date are selected
  useEffect(() => {
    if (selectedFacility && selectedDate) {
      loadAvailability();
    }
  }, [selectedFacility, selectedDate, currentMonth]);

  const loadAvailability = async () => {
    try {
      setLoadingSlots(true);
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate).padStart(2, '0');
      const tanggal = `${year}-${month}-${day}`;

      const response = await availabilityService.checkAvailability(selectedFacility, tanggal);
      
      if (response.success) {
        setTimeSlots(response.data.slots);
        // Reset selected times if date/facility changed
        setSelectedTimes([]);
      }
      setLoadingSlots(false);
    } catch (error) {
      console.error('Error loading availability:', error);
      setLoadingSlots(false);
      // Fallback to default slots
      setDefaultTimeSlots();
    }
  };

  const handleEdit = (booking) => {
    // Set data dari booking yang dipilih untuk edit
    setFormData({
      nama: booking.nama,
      noHP: booking.no_telepon,
      email: booking.email || ''
    });
    // Set facility and date based on booking data
    setSelectedFacility(booking.id_lapangan);
    // Parse tanggal booking
    const bookingDate = new Date(booking.tanggal);
    setSelectedDate(bookingDate.getDate());
    setCurrentMonth(bookingDate);
    // TODO: Set selected times based on jam_mulai and jam_selesai
    setSelectedTimes([]);
    setShowEditBooking(true);
  };

  const handleDelete = async (id_booking) => {
    if (!confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
      return;
    }

    try {
      const response = await bookingService.deleteBooking(id_booking);
      if (response.success) {
        alert('Booking berhasil dihapus');
        loadBookings(); // Reload data
      } else {
        alert(response.message || 'Gagal menghapus booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Terjadi kesalahan saat menghapus booking');
    }
  };

  const handleLanjut = () => {
    setShowDetailBooking(true);
    setShowTambahBooking(false);
  };

  // Generate calendar days
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty slots for days before the 1st
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Initialize default time slots
  useEffect(() => {
    if (timeSlots.length === 0) {
      setDefaultTimeSlots();
    }
  }, []);

  const setDefaultTimeSlots = () => {
    const defaultSlots = [];
    for (let hour = 7; hour <= 23; hour++) {
      defaultSlots.push({
        time: `${String(hour).padStart(2, '0')}.00`,
        status: 'available'
      });
    }
    setTimeSlots(defaultSlots);
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sept', 'Okt', 'Nov', 'Des'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const handleTimeClick = (time, status) => {
    if (status === 'booked') return;
    
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const calculateTotal = () => {
    if (!selectedFacilityData) return 0;
    const pricePerHour = parseFloat(selectedFacilityData.harga);
    return selectedTimes.length * pricePerHour;
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
    return timeString.substring(0, 5); // "HH:MM:SS" -> "HH:MM"
  };

  const filteredBookings = bookings.filter(booking => {
    if (!filterText) return true;
    const searchText = filterText.toLowerCase();
    return (
      booking.nama?.toLowerCase().includes(searchText) ||
      booking.no_telepon?.includes(searchText) ||
      booking.email?.toLowerCase().includes(searchText) ||
      booking.nama_lapangan?.toLowerCase().includes(searchText) ||
      booking.status?.toLowerCase().includes(searchText)
    );
  });

  const formatDate = () => {
    if (!selectedDate) {
      const today = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return `${days[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    }
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return `${days[date.getDay()]}, ${selectedDate} ${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  const formatTimeRange = () => {
    if (selectedTimes.length === 0) return '09.00 - 12.00';
    const times = [...selectedTimes].sort();
    return `${times[0]} - ${times[times.length - 1]}`;
  };

  // If showEditBooking is true, render Edit Booking page
  if (showEditBooking) {
    const totalHarga = calculateTotal() || 135000;
    const hargaDP = totalHarga * 0.5;

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
              <h1 className="text-5xl font-bold text-gray-900">Edit Booking</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow">
                  <User className="w-6 h-6" />
                  <span className="font-semibold">Admin</span>
                </div>
                <span className="text-xs font-medium text-gray-700 mt-2">11-9-2025 18.35</span>
              </div>
              <button className="bg-white p-3 rounded-full shadow hover:shadow-lg transition-shadow">
                <DoorOpen className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Edit Booking Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="space-y-6">
              {/* Nama */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* No. HP */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">No. HP</label>
                <input
                  type="text"
                  value={formData.noHP}
                  onChange={(e) => setFormData({ ...formData, noHP: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Monitoring Jadwal */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Monitoring Jadwal</h3>

                {/* Dropdown Pilih Lapangan */}
                <div className="mb-6">
                  <div className="relative">
                    <select
                      value={selectedFacility}
                      onChange={(e) => setSelectedFacility(e.target.value)}
                      className="w-1/2 px-5 py-3.5 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none"
                    >
                      <option value="">Pilih Lapangan</option>
                      {facilities.map((facility) => (
                        <option key={facility.id_lapangan} value={facility.id_lapangan}>
                          {facility.nama_lapangan} - {formatRupiah(facility.harga)}/jam
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-[48%] top-1/2 -translate-y-1/2 -translate-x-8 w-5 h-5 text-gray-900 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Calendar Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-base font-bold text-gray-900">Pilih Tanggal</label>
                      <button className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="space-y-2">
                      {/* Day Headers */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Mon', 'Sun', 'Mon', 'Mon', 'Mon'].map((day, i) => (
                          <div key={i} className="text-center text-xs font-medium text-gray-600">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-2">
                        {generateCalendar().map((day, index) => (
                          <button
                            key={index}
                            onClick={() => day && setSelectedDate(day)}
                            disabled={!day}
                            className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                              day
                                ? selectedDate === day
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                : 'invisible'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Time Slots Section */}
                  <div>
                    {/* Time Slots Grid */}
                    <div className="grid grid-cols-5 gap-3 mb-6">
                      {timeSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleTimeClick(slot.time, slot.status)}
                          disabled={slot.status === 'booked' || slot.status === 'pending'}
                          className={`px-4 py-3 rounded-full text-sm font-bold transition-all ${
                            slot.status === 'booked'
                              ? 'bg-[#FF6B6B] text-white cursor-not-allowed'
                            : slot.status === 'pending'
                              ? 'bg-[#51CF66] text-white cursor-not-allowed'
                            : selectedTimes.includes(slot.time)
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border-2 border-gray-900 text-gray-900 hover:border-green-500'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-white border-2 border-gray-900 rounded" />
                        <span className="font-medium text-gray-900">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-[#FF6B6B] rounded" />
                        <span className="font-medium text-gray-900">Booked (Lunas)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-[#51CF66] rounded" />
                        <span className="font-medium text-gray-900">Pending (Proses Bayar)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Harga & Harga DP */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between py-3 border-b-2 border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total Harga</span>
                  <span className="text-base font-bold text-gray-900">
                    {formatRupiah(totalHarga)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-base font-bold text-gray-900">Harga DP 50%</span>
                  <span className="text-base font-bold text-gray-900">
                    {formatRupiah(hargaDP)}
                  </span>
                </div>
              </div>

              {/* Status Pembayaran */}
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">Status Pembayaran</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStatusPembayaran('DP')}
                      className={`px-8 py-2.5 rounded-xl font-bold text-base transition-all ${
                        statusPembayaran === 'DP'
                          ? 'bg-green-500 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      DP
                    </button>
                    <button
                      onClick={() => setStatusPembayaran('Lunas')}
                      className={`px-8 py-2.5 rounded-xl font-bold text-base transition-all ${
                        statusPembayaran === 'Lunas'
                          ? 'bg-green-500 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Lunas
                    </button>
                  </div>
                </div>
              </div>

              {/* Button Simpan */}
              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setShowEditBooking(false)}
                  className="px-12 py-3 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If showDetailBooking is true, render Detail Booking page
  if (showDetailBooking) {
    const totalHarga = calculateTotal();
    const hargaDP = totalHarga * 0.5;

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
              <h1 className="text-5xl font-bold text-gray-900">Detail Booking</h1>
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

          {/* Detail Booking Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg max-w-3xl">
            <div className="space-y-6">
              {/* Nama */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nama</label>
                <input
                  type="text"
                  value={formData.nama || 'Faiz'}
                  readOnly
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 bg-white text-gray-700"
                />
              </div>

              {/* No. HP */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">No. HP</label>
                <input
                  type="text"
                  value={formData.noHP || '+62 800-0000-0000'}
                  readOnly
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 bg-white text-gray-700"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || 'faiz@gamil.com'}
                  readOnly
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 bg-white text-gray-700"
                />
              </div>

              {/* Detail Booking Box */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Detail Booking</h3>
                <div className="space-y-1 text-gray-700">
                  <p>Lapangan {selectedFacilityData?.nama_lapangan || 'Badminton A'}</p>
                  <p>{formatDate()}</p>
                  <p>{formatTimeRange()}</p>
                </div>
              </div>

              {/* Total Harga */}
              <div className="flex items-center justify-between py-4 border-b-2 border-gray-200">
                <span className="text-base font-bold text-gray-900">Total Harga</span>
                <span className="text-base font-bold text-gray-900">
                  {formatRupiah(totalHarga || 135000)}
                </span>
              </div>

              {/* Harga DP */}
              <div className="flex items-center justify-between py-4">
                <span className="text-base font-bold text-gray-900">Harga DP 50%</span>
                <span className="text-base font-bold text-gray-900">
                  {formatRupiah(hargaDP || 67500)}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  onClick={() => {
                    setShowDetailBooking(false);
                    setShowTambahBooking(true);
                  }}
                  className="px-8 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-400"
                >
                  Kembali
                </button>
                <button className="px-12 py-3 bg-green-500 text-white rounded-xl font-bold text-base hover:bg-green-600">
                  Booking
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If showTambahBooking is true, render Tambah Booking page instead
  if (showTambahBooking) {
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
              <h1 className="text-5xl font-bold text-gray-900">Tambah Booking</h1>
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

          {/* Form Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <div className="space-y-6">
              {/* Nama */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* No. HP */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">No. HP</label>
                <input
                  type="text"
                  value={formData.noHP}
                  onChange={(e) => setFormData({...formData, noHP: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Monitoring Jadwal Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Monitoring Jadwal</h3>

            {/* Dropdown Pilih Lapangan */}
            <div className="mb-8">
              <div className="relative">
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-1/2 px-5 py-3.5 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none"
                >
                  <option value="">Pilih Lapangan</option>
                  {facilities.map((facility) => (
                    <option key={facility.id_lapangan} value={facility.id_lapangan}>
                      {facility.nama_lapangan} - {formatRupiah(facility.harga)}/jam
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-[48%] top-1/2 -translate-y-1/2 -translate-x-8 w-5 h-5 text-gray-900 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-base font-bold text-gray-900">Pilih Tanggal</label>
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-2">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Mon', 'Sun', 'Mon', 'Mon', 'Mon'].map((day, i) => (
                      <div key={i} className="text-center text-xs font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {generateCalendar().map((day, index) => (
                      <button
                        key={index}
                        onClick={() => day && setSelectedDate(day)}
                        disabled={!day}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                          day
                            ? selectedDate === day
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            : 'invisible'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <div>
                {/* Time Slots Grid */}
                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-600"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading availability...</p>
                  </div>
                ) : (
                  <>
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeClick(slot.time, slot.status)}
                      disabled={slot.status === 'booked' || slot.status === 'pending'}
                      className={`px-4 py-3 rounded-full text-sm font-bold transition-all ${
                        slot.status === 'booked'
                          ? 'bg-[#FF6B6B] text-white cursor-not-allowed'
                        : slot.status === 'pending'
                          ? 'bg-[#51CF66] text-white cursor-not-allowed'
                        : selectedTimes.includes(slot.time)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border-2 border-gray-900 text-gray-900 hover:border-green-500'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-white border-2 border-gray-900 rounded" />
                    <span className="font-medium text-gray-900">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-[#FF6B6B] rounded" />
                    <span className="font-medium text-gray-900">Booked (Lunas)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-[#51CF66] rounded" />
                    <span className="font-medium text-gray-900">Pending (Proses Bayar)</span>
                  </div>
                </div>
                </>
                )}
              </div>
            </div>
          </div>

          {/* Total Harga & Button */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-gray-900">Total Harga</span>
                <input
                  type="text"
                  value={calculateTotal() > 0 ? formatRupiah(calculateTotal()) : 'Auto-generated'}
                  readOnly
                  className="px-6 py-3 bg-gray-100 rounded-xl text-gray-500 text-base text-center w-56"
                />
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowTambahBooking(false)}
                  className="px-8 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-400"
                >
                  Kembali
                </button>
                <button 
                  onClick={handleLanjut}
                  className="px-12 py-3 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600"
                >
                  Lanjut
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            <h1 className="text-5xl font-bold text-gray-900">Booking</h1>
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

        {/* Monitoring Jadwal Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Monitoring Jadwal</h3>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* LEFT SECTION - Dropdown & Calendar */}
            <div className="lg:col-span-2 space-y-8">
              {/* Dropdown Pilih Lapangan */}
              <div>
                <div className="relative">
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="">Pilih Lapangan</option>
                    <option value="futsal">Lapangan Futsal</option>
                    <option value="badminton-1">Lapangan Badminton 1</option>
                    <option value="badminton-2">Lapangan Badminton 2</option>
                    <option value="badminton-3">Lapangan Badminton 3</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900 pointer-events-none" />
                </div>
              </div>

              {/* Calendar Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-base font-bold text-gray-900">
                    Pilih Tanggal
                  </label>
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-[1px]">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-[1px] mb-[2px]">
                    {dayNames.map((day, i) => (
                      <div
                        key={i}
                        className="text-center text-[10px] font-medium text-gray-600 leading-none"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-[1px]">
                    {generateCalendar().map((day, index) => (
                      <button
                        key={index}
                        onClick={() => day && setSelectedDate(day)}
                        disabled={!day}
                        className={`w-1 h-1 sm:w-14 sm:h-7 flex items-center justify-center rounded-full text-[11px] font-medium transition-all ${
                          day
                            ? selectedDate === day
                              ? 'bg-gray-900 text-white'
                              : 'bg-white hover:bg-gray-100 text-gray-900'
                            : 'invisible'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - Time Slots */}
            <div className="lg:col-span-3">
              <label className="block text-base font-bold text-gray-900 mb-5">
                Pilih Jam
              </label>
              
              {/* Time Slots Grid */}
              <div className="grid grid-cols-6 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={slot.status === 'booked' || slot.status === 'pending'}
                    className={`px-6 py-4 rounded-full text-base font-bold transition-all ${
                      slot.status === 'booked'
                        ? 'bg-[#FF6B6B] text-white cursor-not-allowed'
                      : slot.status === 'pending'
                        ? 'bg-[#51CF66] text-white cursor-not-allowed'
                        : 'bg-white border-2 border-gray-900 text-gray-900 hover:border-green-500'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-black border-2 rounded-3xl" />
                  <span className="text-sm font-medium text-gray-900">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-[#FF6B6B] rounded-3xl" />
                  <span className="text-sm font-medium text-gray-900">Booked (Lunas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-[#51CF66] rounded-3xl" />
                  <span className="text-sm font-medium text-gray-900">Pending (Proses Bayar)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Booking Terbaru */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Tabel Booking Terbaru</h3>
            
            {/* Filter and Actions */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter Nama / Lapangan / Tanggal / Status"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="px-4 py-2 pr-10 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 w-80"
                />
              </div>
              <button 
                onClick={() => setShowTambahBooking(true)}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600"
              >
                <span>+</span> Tambah Booking
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Waktu Booking</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">No.HP</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Lapangan</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Tanggal Booking</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Jam booking</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Harga DP</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Total Harga</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Aksi</th>
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
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data booking
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id_booking} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-700">{formatDateTime(booking.created_at)}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{booking.no_telepon}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{booking.email || '-'}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{booking.nama_lapangan}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{formatDateTime(booking.tanggal)}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {formatTime(booking.jam_mulai)} - {formatTime(booking.jam_selesai)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {formatRupiah(booking.harga_dp || (booking.total_harga * 0.5))}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">{formatRupiah(booking.total_harga)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.status === 'Dikonfirmasi' ? 'bg-green-100 text-green-700' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'Dibatalkan' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(booking)}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(booking.id_booking)}
                            className="px-3 py-1 bg-red-500 rounded-md text-xs font-medium text-white hover:bg-red-600"
                          >
                            Hapus
                          </button>
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
            <p className="text-sm text-gray-600">Showing {filteredBookings.length} of {bookings.length} List</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Prev
              </button>
              <button className="w-10 h-10 rounded-lg bg-green-500 text-white font-bold">
                1
              </button>
              <button className="px-4 py-2 text-sm font-medium text-green-500 hover:text-green-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bookings;
