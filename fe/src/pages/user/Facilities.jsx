import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import futsalImg from "../../assets/images/futsal.png";
import badmintonImg from "../../assets/images/badminton.png";
import { getAllFacilities } from "../../services/facilityService";

const Landing = () => {
  const facilitiesRef = useRef(null);
  const scrollToFacilities = () => facilitiesRef.current?.scrollIntoView({ behavior: "smooth" });
  const [facilities, setFacilities] = useState([]);
  const [futsalData, setFutsalData] = useState(null);
  const [badmintonData, setBadmintonData] = useState([]);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const response = await getAllFacilities();
      if (response.success) {
        const available = response.data.filter(f => f.status === 'Tersedia');
        setFacilities(available);
        
        // Separate futsal and badminton
        const futsal = available.filter(f => f.jenis.toLowerCase() === 'futsal');
        const badminton = available.filter(f => f.jenis.toLowerCase() === 'badminton');
        
        setFutsalData(futsal.length > 0 ? futsal[0] : null);
        setBadmintonData(badminton);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2
    }).format(angka);
  };

  return (
    <div className="relative bg-black text-white font-sans">
      {/* ===== NAVBAR FIXED (glassmorphism) ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
          <div className="text-2xl font-bold font-orbitron">
            Queen<span className="text-green-500">Sport</span>Hall
          </div>
          <div className="flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-white hover:text-green-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={scrollToFacilities}
              className="text-white hover:text-green-400 transition-colors"
            >
              Facilities
            </button>
            <Link to="/faq" className="text-white hover:text-green-400 transition-colors">
              FAQ
            </Link>
            <Link
              to="/booking"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-green-500/50"
            >
              Booking
            </Link>
          </div>
        </div>
      </nav>

      {/* ===================== SECTION: HOME ===================== */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-20">
        {/* Cahaya 1 - atas tengah (khusus untuk section Home) */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-[120px] pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, transparent 70%)'
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 text-center">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Open 07.00 - 20.00</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-orbitron text-white mb-6 tracking-tight">
            QUEEN SPORT HALL
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
            Pilih tanggal & jam, dapatkan tiket otomatis. Hemat waktu, fokus ke pertandinganmu!
          </p>

          <Link
            to="/booking"
            className="bg-green-600 hover:bg-green-500 text-white text-lg font-semibold px-12 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95"
          >
            Booking
          </Link>

          <div className="mt-16 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-white/70 text-sm">2 Tipe Lapangan</span>
          </div>
        </div>

        {/* Transisi smooth ke Facilities */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-b from-transparent via-black/60 to-black pointer-events-none" />
      </section>

      {/* ===================== SECTION: FACILITIES ===================== */}
      <section
        ref={facilitiesRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-white px-6 py-32"
      >
        {/* Overlay transparan */}
        <div className="absolute inset-0 bg-black/50 -z-10" />

        {/* Cahaya 2 - kanan tengah (khusus untuk section Facilities) */}
        <div 
          className="absolute top-[20%] right-[-100px] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)'
          }}
        />
        
        {/* Cahaya 3 - kiri tengah (khusus untuk section Facilities) */}
        <div 
          className="absolute top-[60%] left-[-100px] w-[400px] h-[400px] rounded-full blur-[150px] pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)'
          }}
        />

        <h1 className="relative z-10 text-5xl md:text-6xl font-bold font-orbitron mb-12">
          FACILITIES
        </h1>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
          <div className="relative rounded-2xl overflow-hidden group shadow-xl shadow-black/50">
            <img
              src={futsalImg}
              alt="Lapangan Futsal"
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold">{futsalData ? futsalData.nama_lapangan : 'Lapangan Futsal'}</h2>
                <p className="text-lg font-semibold">{futsalData ? formatRupiah(futsalData.harga) : 'Rp 100.000,00'}/jam</p>
              </div>
              <p className="text-white/80 text-sm">1 Lapangan Futsal</p>
              <p className="text-white/80 text-sm">Fasilitas : Indoor, Bola</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden group shadow-xl shadow-black/50">
            <img
              src={badmintonImg}
              alt="Lapangan Badminton"
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold">Lapangan Badminton</h2>
                <p className="text-lg font-semibold">{badmintonData.length > 0 ? formatRupiah(badmintonData[0].harga) : 'Rp 40.000,00'}/jam</p>
              </div>
              <p className="text-white/80 text-sm">{badmintonData.length} Lapangan Badminton</p>
              <p className="text-white/80 text-sm">Fasilitas : Indoor, Raket, Shuttlecock</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;