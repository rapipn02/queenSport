import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { getAllFacilities } from '../../services/facilityService';
import bookingService from '../../services/bookingService';
import availabilityService from '../../services/availabilityService';

const BookingSchedule = () => {
  const navigate = useNavigate();
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityData, setSelectedFacilityData] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Initialize with default available slots
  useEffect(() => {
    if (timeSlots.length === 0) {
      setDefaultTimeSlots();
    }
  }, []);

  // Load facilities
  useEffect(() => {
    loadFacilities();
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

  // Update selected facility data
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

  const setDefaultTimeSlots = () => {
    const defaultSlots = [];
    for (let hour = 7; hour < 20; hour++) {
      defaultSlots.push({
        time: `${String(hour).padStart(2, '0')}.00`,
        status: 'available'
      });
    }
    setTimeSlots(defaultSlots);
  };

  // Generate calendar days for September 2025
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

  const handleTimeClick = (time, status) => {
    if (status === 'booked') return; // Cannot select booked slots
    
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

  const handleSubmit = async () => {
    // Debug log
    console.log('Submit clicked:', {
      selectedFacility,
      selectedDate,
      selectedTimes,
      selectedTimesLength: selectedTimes.length
    });

    // Validasi
    if (!selectedFacility || !selectedDate || selectedTimes.length === 0) {
      alert('Mohon lengkapi pilihan lapangan, tanggal, dan jam');
      return;
    }

    // Ambil data user dari localStorage
    const userDataStr = localStorage.getItem('bookingUserData');
    if (!userDataStr) {
      alert('Data pemesanan tidak ditemukan. Mohon isi data terlebih dahulu.');
      navigate('/booking');
      return;
    }

    const userData = JSON.parse(userDataStr);

    // Format tanggal booking (YYYY-MM-DD)
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate).padStart(2, '0');
    const tanggalBooking = `${year}-${month}-${day}`;

    // Sort selected times
    const sortedTimes = [...selectedTimes].sort();

    // Prepare booking data (sesuai dengan backend API)
    const bookingData = {
      nama: userData.nama,
      no_telepon: userData.noHP,
      email: userData.email,
      id_lapangan: parseInt(selectedFacility),
      tanggal: tanggalBooking, // Backend expect 'tanggal' not 'tanggal_booking'
      jam_slots: sortedTimes, // Backend expect array of strings ['09.00', '10.00']
      metode_pembayaran: 'DP' // Backend expect 'metode_pembayaran', DP = 50%
    };

    try {
      console.log('=== BOOKING DATA TO SEND ===');
      console.log('User Data:', userData);
      console.log('Booking Data:', JSON.stringify(bookingData, null, 2));
      console.log('===========================');
      
      // Call API to create booking
      const response = await bookingService.createBooking(bookingData);
      
      console.log('API Response:', response);
      
      if (response.success) {
        // Simpan data untuk booking detail
        localStorage.setItem('snapToken', response.data.snap_token);
        localStorage.setItem('bookingId', response.data.id_booking);
        
        console.log('Booking created successfully:', response.data);
        
        // Construct booking data object untuk BookingDetail
        const completeBookingData = {
          id_booking: response.data.id_booking,
          nama: userData.nama,
          no_telepon: userData.noHP,
          email: userData.email,
          tanggal_booking: tanggalBooking, // Add tanggal_booking
          total_harga: response.data.total_harga,
          durasi_jam: response.data.durasi_jam,
          metode_pembayaran: 'DP',
          status_booking: 'Menunggu'
        };
        
        console.log('Complete booking data to send:', completeBookingData);
        
        // Navigate ke booking detail page (bukan langsung ke payment)
        navigate('/booking-detail', {
          state: {
            bookingData: completeBookingData,
            snapToken: response.data.snap_token,
            facilityData: selectedFacilityData,
            selectedTimes: sortedTimes,
            tanggalBooking: tanggalBooking
          }
        });
      } else {
        alert(response.message || 'Gagal membuat booking');
      }
    } catch (error) {
      console.error('=== ERROR CREATING BOOKING ===');
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('==============================');
      
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat membuat booking. Silakan coba lagi.';
      alert(errorMessage);
    }
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
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Mon', 'Sun', 'Mon', 'Mon', 'Mon'];

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
          to="/booking"
          className="absolute top-6 left-6 z-20 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all hover:shadow-lg"
        >
          ← Back
        </Link>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[25vh] px-4">
          <div className="flex items-center gap-2  px-6 py-3 mt-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Open 07.00 - 20.00</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-orbitron tracking-tight mb-14">
            BOOKING
          </h1>
        </div>
      </div>

      {/* === BAGIAN PUTIH (FORM) === */}
        <div className="w-full min-h-[75vh] bg-white rounded-t-[3rem] -mt-8 shadow-2xl pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
          {/* Pilih Jadwal Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Pilih Jadwal
          </h2>

          {/* Dropdown Pilih Lapangan */}
          <div className="mb-8">
            <div className="relative w-1/2">
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full px-5 py-3.5 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT SECTION - Calendar */}
            <div className="lg:col-span-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-bold text-gray-900">
                  Pilih Tanggal
                </label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const newMonth = new Date(currentMonth);
                      newMonth.setMonth(newMonth.getMonth() - 1);
                      setCurrentMonth(newMonth);
                      setSelectedDate(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-all"
                    title="Bulan Sebelumnya"
                  >
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-xs font-semibold text-gray-900 min-w-[80px] text-center">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button 
                    onClick={() => {
                      const newMonth = new Date(currentMonth);
                      newMonth.setMonth(newMonth.getMonth() + 1);
                      setCurrentMonth(newMonth);
                      setSelectedDate(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-all"
                    title="Bulan Berikutnya"
                  >
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-1">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {dayNames.map((day, i) => (
                    <div
                      key={i}
                      className="text-center text-[10px] font-medium text-gray-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendar().map((day, index) => (
                    <button
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      disabled={!day}
                      className={`aspect-square flex items-center justify-center rounded text-[11px] font-medium transition-all ${
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

            {/* RIGHT SECTION - Time Slots */}
            <div className="lg:col-span-8">
              {/* Time Slots Grid */}
              {loadingSlots ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-600"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading availability...</p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-6 gap-3 mb-6">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleTimeClick(slot.time, slot.status)}
                        disabled={slot.status === 'booked'}
                        className={`px-6 py-4 rounded-full text-base font-bold transition-all ${
                          slot.status === 'booked'
                            ? 'bg-[#FF6B6B] text-white cursor-not-allowed'
                            : selectedTimes.includes(slot.time)
                            ? 'bg-[#51CF66] text-white'
                            : 'bg-white border-2 border-gray-900 text-gray-900 hover:border-green-500'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 border-2 border-gray-900 rounded-full" />
                      <span className="font-medium text-gray-900">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-[#FF6B6B] rounded-full" />
                      <span className="font-medium text-gray-900">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-[#51CF66] rounded-full" />
                      <span className="font-medium text-gray-900">Aktif</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Bar */}
      <div className="fixed bottom-14 left-0 right-0 text-white py-2 px-8 flex items-center justify-center z-40 shadow-2xl bg-black/80 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_2%,rgba(0,0,0,1)_50%,rgba(102,102,102,1)_100%)]">
        <div className="text-lg font-bold justify-center">
          Total Harga <span className="ml-1">{formatRupiah(calculateTotal())}</span>
        </div>
      </div>


      
      {/* Bottom lanjut Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#00800F] text-white py-4 px-8 flex items-center justify-center z-50 shadow-2xl">
        <button
          onClick={handleSubmit}
          disabled={!selectedFacility || !selectedDate || selectedTimes.length === 0}
          className={`font-bold text-xl w-full transition-all ${
            !selectedFacility || !selectedDate || selectedTimes.length === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90 cursor-pointer'
          }`}
        >
          Lanjut
        </button>
      </div>
    </>
  );
};

export default BookingSchedule;