import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Booking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    noHP: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi data
    if (!formData.nama || !formData.noHP || !formData.email) {
      alert('Mohon lengkapi semua data');
      return;
    }

    // Simpan data ke localStorage
    localStorage.setItem('bookingUserData', JSON.stringify(formData));
    console.log('Booking data saved:', formData);
    
    // Redirect ke halaman booking schedule
    navigate('/booking-schedule');
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
  
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-orbitron tracking-tight mb-9">
              BOOKING
            </h1>
          </div>
        </div>

      {/* === BAGIAN PUTIH (FORM) === */}
        <div className="w-full min-h-[75vh] bg-white rounded-t-[3rem] -mt-8 shadow-2xl pb-10">
        <h2 className="text-2xl font-bold text-gray-800 mt-12 text-center">
          ISI DATA PEMESANAN BERIKUT
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-6 text-center"
        >
          <div className="w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              placeholder="Nama Kamu"
              value={formData.nama}
              onChange={handleChange}
              className="block w-full px-6 py-4 mx-auto bg-gray-50 border border-gray-300 rounded-xl text-gray-800 
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              No. HP
            </label>
            <input
              type="tel"
              name="noHP"
              placeholder="+62 8xxx-xxxx-xxxx"
              value={formData.noHP}
              onChange={handleChange}
              className="block w-full px-6 py-4 mx-auto bg-gray-50 border border-gray-300 rounded-xl text-gray-800 
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email Kamu"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-6 py-4 mx-auto bg-gray-50 border border-gray-300 rounded-xl text-gray-800 
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-2/3 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all 
                      duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-8"
          >
            Lanjut
          </button>
        </form>
      </div>
    </>
  );
};

export default Booking;