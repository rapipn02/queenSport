import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import futsalImg from "../../assets/images/futsal.png";
import badmintonImg from "../../assets/images/badminton.png";
import waIcon from "../../assets/images/wa.png";
import igIcon from "../../assets/images/ig.png";

const Landing = () => {
  const facilitiesRef = useRef(null);
  const locationRef = useRef(null);
  const faqRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  const scrollToFacilities = () => facilitiesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToLocation = () => locationRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToFAQ = () => faqRef.current?.scrollIntoView({ behavior: "smooth" });

  // Generate random stars
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

  const faqs = [
    {
      question: "Bagaimana cara melakukan pemesanan lapangan?",
      answer: "Anda dapat melakukan pemesanan lapangan melalui halaman Booking di website kami. Pilih jenis lapangan, tanggal, dan jam yang diinginkan, lalu lakukan pembayaran melalui Midtrans untuk konfirmasi booking."
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Kami menerima berbagai metode pembayaran melalui Midtrans, termasuk transfer bank (BCA, Mandiri, BNI, BRI), kartu kredit/debit, e-wallet (GoPay, OVO, DANA, ShopeePay), dan Indomaret/Alfamart."
    },
    {
      question: "Apakah bisa membatalkan atau mengubah jadwal booking?",
      answer: "Pembatalan atau perubahan jadwal dapat dilakukan maksimal 24 jam sebelum waktu booking. Silakan hubungi admin kami untuk proses pembatalan atau perubahan jadwal. Refund akan diproses dalam 3-5 hari kerja."
    },
    {
      question: "Apakah ada fasilitas parkir di lokasi?",
      answer: "Ya, tersedia area parkir yang luas dan aman untuk kendaraan roda dua maupun roda empat secara gratis bagi semua pelanggan yang melakukan booking."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
      offset: 100
    });
  }, []);

  return (
    <div className="relative w-full bg-black text-white font-sans overflow-x-hidden">
      {/* ===== WRAPPER CAHAYA GLOBAL - TEMBUS SEMUA SECTION ===== */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Cahaya 1 - Home Section (Atas Tengah) */}
        <div 
          className="absolute w-[700px] h-[700px] rounded-full blur-[150px]"
          style={{
            top: '-40vh',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 10%, transparent 70%)',
          }}
        />

        {/* Cahaya 2 - Facilities Section (Kanan) */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{
            top: '105vh',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 50%, transparent 70%)',
          }}
        />
        
        {/* Cahaya 3 - Facilities Section (Kiri) */}
        <div 
          className="absolute w-[550px] h-[550px] rounded-full blur-[140px]"
          style={{
            top: '90vh',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          }}
        />

        {/* Cahaya 4 - Location Section (Tengah) */}
        <div 
          className="absolute w-[650px] h-[650px] rounded-full blur-[160px]"
          style={{
            top: '210vh',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.32) 30%, transparent 70%)',
          }}
        />

        {/* Cahaya 5 - FAQ Section (Kanan) */}
        <div 
          className="absolute w-[580px] h-[580px] rounded-full blur-[145px]"
          style={{
            top: '270vh',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.55) 10%, rgba(255,255,255,0.28) 50%, transparent 70%)',
          }}
        />
        
      </div>

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
            <button
              onClick={scrollToLocation}
              className="text-white hover:text-green-400 transition-colors"
            >
              Location
            </button>
            <button
              onClick={scrollToFAQ}
              className="text-white hover:text-green-400 transition-colors"
            >
              FAQ
            </button>
            <Link
              to="/booking"
              className="bg-green-600 hover:bg-green-10 text-white px-6 py-2.5 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-green-60/50"
            >
              Booking
            </Link>
          </div>
        </div>
      </nav>

      {/* ===================== SECTION: HOME ===================== */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center pt-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black-950 to-black" style={{ zIndex: 0 }} />

        {/* Stars */}
        {generateStars(30).map((star) => (
          <div
            key={`home-${star.id}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: star.animationDelay,
              animationDuration: '3s',
              zIndex: 2
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 text-center">
          <div 
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
            data-aos="fade-down"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Open 07.00 - 20.00</span>
          </div>

          <h1 
            className="text-6xl md:text-7xl lg:text-8xl font-bold font-orbitron text-white mb-6 tracking-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            QUEEN SPORT HALL
          </h1>

          <p 
            className="text-white/80 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Pilih tanggal & jam, dapatkan tiket otomatis. Hemat waktu, fokus ke pertandinganmu!
          </p>

          <Link
            to="/booking"
            className="bg-[#00800F] hover:bg-[#00A013] text-white text-lg font-semibold px-16 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-[#00A013]/50 hover:scale-105 active:scale-95"
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            Booking
          </Link>


          <div 
            className="mt-14 flex items-center gap-2"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-white/70 text-sm">2 Tipe Lapangan</span>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: FACILITIES ===================== */}
      <section
        ref={facilitiesRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-white px-6 py-32 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black-950 to-black" style={{ zIndex: 0 }} />

        {/* Stars */}
        {generateStars(30).map((star) => (
          <div
            key={`facilities-${star.id}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: star.animationDelay,
              animationDuration: '3s',
              zIndex: 2
            }}
          />
        ))}

        <h1 
          className="relative z-10 text-5xl md:text-6xl font-bold font-orbitron mb-12"
          data-aos="fade-up"
        >
          FACILITIES
        </h1>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
          <div 
            className="relative rounded-2xl overflow-hidden group shadow-xl shadow-black/50"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <img
              src={futsalImg}
              alt="Lapangan Futsal"
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold">Lapangan Futsal</h2>
                <p className="text-lg font-semibold">Rp 100.000,00/jam</p>
              </div>
              <p className="text-white/80 text-sm">1 Lapangan Futsal</p>
              <p className="text-white/80 text-sm">Fasilitas : Indoor, Bola</p>
            </div>
          </div>

          <div 
            className="relative rounded-2xl overflow-hidden group shadow-xl shadow-black/50"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <img
              src={badmintonImg}
              alt="Lapangan Badminton"
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold">Lapangan Badminton</h2>
                <p className="text-lg font-semibold">Rp 45.000,00/jam</p>
              </div>
              <p className="text-white/80 text-sm">3 Lapangan Badminton</p>
              <p className="text-white/80 text-sm">Fasilitas : Indoor, Bola</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: LOCATION ===================== */}
      <section
        ref={locationRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-white px-6 py-32 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black-950 to-black" style={{ zIndex: 0 }} />

        {/* Stars */}
        {generateStars(30).map((star) => (
          <div
            key={`location-${star.id}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: star.animationDelay,
              animationDuration: '3s',
              zIndex: 2
            }}
          />
        ))}

        <h1 
          className="relative z-10 text-5xl md:text-6xl font-bold font-orbitron mb-16"
          data-aos="fade-up"
        >
          LOCATION
        </h1>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full items-center">
          {/* Google Maps */}
          <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 h-[400px]"
            data-aos="fade-right"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.30317340877!2d100.44758027460014!3d-0.9207278990703611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b7b1aed8348f%3A0x1a42a3a6e3556ccc!2sQueen%20Sport%20Hall!5e0!3m2!1sid!2sid!4v1762340022460!5m2!1sid!2sid"
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Queen Sport Hall Location"
            />
          </div>

          {/* Location Info */}
          <div 
            className="relative z-10 flex flex-col justify-center"
            data-aos="fade-left"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-6">
              Queen Sport Hall
            </h2>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed">
              3CHX+MWW, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176
            </p>
            
            {/* Additional Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-white font-semibold">Jam Operasional</p>
                  <p className="text-white/70">07.00 - 20.00 WIB</p>
                </div>
              </div>
            </div>

            {/* CTA Button */} 
            <Link
              to="/booking"
              className="mt-8 inline-block bg-[#00800F]  hover:bg-green-500 text-white text-lg font-semibold p`x-10 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-green-70/50 hover:scale-35 active:scale-45 text-center"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== SECTION: FAQ ===================== */}
      <section
        ref={faqRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-32 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black-950 to-black" style={{ zIndex: 0 }} />

        {/* Stars */}
        {generateStars(30).map((star) => (
          <div
            key={`faq-${star.id}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: star.animationDelay,
              animationDuration: '3s',
              zIndex: 2
            }}
          />
        ))}

        <div className="relative z-10 max-w-4xl w-full">
          <h1 
            className="text-5xl md:text-6xl font-bold font-orbitron text-center mb-20"
            data-aos="fade-up"
          >
            FAQ
          </h1>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-8 py-6 bg-transparent border border-white/20 rounded-full hover:border-white/40 transition-all duration-300"
                >
                  <span className="text-lg text-white font-normal text-left pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <X className="flex-shrink-0 w-6 h-6 text-white transition-transform duration-300" />
                  ) : (
                    <Plus className="flex-shrink-0 w-6 h-6 text-white transition-transform duration-300" />
                  )}
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 py-6 text-white/80 leading-relaxed bg-white/5 rounded-3xl border border-white/10">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer 
        className="relative w-full bg-black border-t border-white/10"
        style={{ zIndex: 20 }}
        data-aos="fade-in"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-6">
          {/* Logo */}
          <div className="text-xl font-bold font-orbitron">
            Queen<span className="text-green-500">Sport</span>Hall
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-6">
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              <img src={waIcon} alt="WhatsApp" className="w-8 h-8" />
            </a>
            <a 
              href="https://instagram.com/queensporthall" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              <img src={igIcon} alt="Instagram" className="w-8 h-8" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;