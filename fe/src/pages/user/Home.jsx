import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-black">
      {/* Efek cahaya lembut di tengah atas */}
<div className="absolute inset-0 z-0 pointer-events-none">
  {/* Cahaya Tengah Atas */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] 
                  bg-gradient-radial from-white/50 via-white/85 to-transparent 
                  rounded-full blur-[190px] opacity-100"></div>

  {/* Cahaya Kanan Bawah */}
  <div className="absolute bottom-[-120px] right-[-80px] 
                  w-[400px] h-[400px] 
                  bg-gradient-radial from-white/50 via-white/55 to-transparent 
                  rounded-full blur-[130px] opacity-80"></div>

  {/* Cahaya Kiri Bawah */}
  <div className="absolute bottom-[-120px] left-[-80px] 
                  w-[400px] h-[400px] 
                  bg-gradient-radial from-white/50 via-white/55 to-transparent 
                  rounded-full blur-[130px] opacity-80"></div>
</div>

      {/* Navigasi */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="text-white text-2xl font-bold font-orbitron">
          Queen<span className="text-green-500">Sport</span>Hall
        </div>
        <div className="flex items-center gap-8">
          <Link to="/" className="text-white hover:text-green-400 transition-colors">Home</Link>
          <Link to="/facilities" className="text-white hover:text-green-400 transition-colors">Facilities</Link>
          <Link to="/faq" className="text-white hover:text-green-400 transition-colors">FAQ</Link>
          <Link 
            to="/booking" 
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-green-500/50"
          >
            Booking
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 text-center">
        {/* Status Badge */}
        <div className="mt-16 flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
          <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
          <span className="text-white text-sm font-medium">Open 07.00 - 20.00</span>
        </div>

        {/* Title */}
        <h1 className="isolate relative z-10 text-6xl md:text-7xl lg:text-8xl font-bold font-orbitron text-white mb-6 tracking-tight">
          QUEEN <span className="!text-green-500 mix-blend-normal relative z-50">SPORT</span> HALL
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
          Pilih tanggal & jam, dapatkan tiket otomatis. Hemat waktu, fokus ke pertandinganmu!
        </p>

        {/* Tombol CTA */}
        <Link 
          to="/booking"
          className="bg-green-600 hover:bg-green-500 text-white text-lg font-semibold px-12 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95"
        >
          Booking
        </Link>

        {/* Feature Badge */}
        <div className="mt-16 flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-white/70 text-sm">2 Tipe Lapangan</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
