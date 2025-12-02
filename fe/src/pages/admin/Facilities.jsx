import React, { useState, useEffect } from 'react';
import { User, DoorOpen } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAllFacilities, getFacilityStats, createFacility, updateFacility, deleteFacility } from '../../services/facilityService';

const Facilities = () => {
  const [showTambahLapangan, setShowTambahLapangan] = useState(false);
  const [showEditLapangan, setShowEditLapangan] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [stats, setStats] = useState({ lapangan_aktif: 0, lapangan_tidak_aktif: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama_lapangan: '',
    jenis: '',
    harga: '',
    status: 'Tersedia'
  });

  // Load facilities data
  useEffect(() => {
    loadFacilities();
    loadStats();
  }, []);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const response = await getAllFacilities();
      if (response.success) {
        setFacilities(response.data);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
      alert('Gagal memuat data lapangan');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getFacilityStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleEdit = (facility) => {
    setSelectedFacility(facility);
    setFormData({
      nama_lapangan: facility.nama_lapangan,
      jenis: facility.jenis,
      harga: facility.harga,
      status: facility.status
    });
    setShowEditLapangan(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
      return;
    }

    try {
      const response = await deleteFacility(id);
      if (response.success) {
        alert('Lapangan berhasil dihapus');
        loadFacilities();
        loadStats();
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert('Gagal menghapus lapangan');
    }
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.nama_lapangan || !formData.jenis || !formData.harga) {
        alert('Semua field harus diisi');
        return;
      }

      if (showEditLapangan) {
        // Update
        const response = await updateFacility(selectedFacility.id_lapangan, formData);
        if (response.success) {
          alert('Lapangan berhasil diupdate');
          setShowEditLapangan(false);
          setSelectedFacility(null);
          resetForm();
          loadFacilities();
          loadStats();
        }
      } else {
        // Create
        const response = await createFacility(formData);
        if (response.success) {
          alert('Lapangan berhasil ditambahkan');
          setShowTambahLapangan(false);
          resetForm();
          loadFacilities();
          loadStats();
        }
      }
    } catch (error) {
      console.error('Error saving facility:', error);
      alert(error.message || 'Gagal menyimpan lapangan');
    }
  };

  const resetForm = () => {
    setFormData({
      nama_lapangan: '',
      jenis: '',
      harga: '',
      status: 'Tersedia'
    });
  };

  const handleTambahClick = () => {
    resetForm();
    setShowTambahLapangan(true);
  };

  const handleCancel = () => {
    setShowTambahLapangan(false);
    setShowEditLapangan(false);
    setSelectedFacility(null);
    resetForm();
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // If showTambahLapangan or showEditLapangan is true, render form page
  if (showTambahLapangan || showEditLapangan) {
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
              <h1 className="text-5xl font-bold text-gray-900">
                {showTambahLapangan ? 'Tambah Lapangan' : 'Edit Lapangan'}
              </h1>
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

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg max-w-3xl">
            <div className="space-y-6">
              {/* Nama Lapangan */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">Nama Lapangan</label>
                <input
                  type="text"
                  value={formData.nama_lapangan}
                  onChange={(e) => setFormData({ ...formData, nama_lapangan: e.target.value })}
                  placeholder="Masukkan nama lapangan"
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Jenis */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">Jenis</label>
                <select
                  value={formData.jenis}
                  onChange={(e) => {
                    const jenis = e.target.value;
                    const harga = jenis === 'Futsal' ? 100000 : jenis === 'Badminton' ? 40000 : '';
                    setFormData({ ...formData, jenis, harga });
                  }}
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Badminton">Badminton</option>
                </select>
              </div>

              {/* Harga Per Jam */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">Harga Per Jam</label>
                <input
                  type="number"
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                  placeholder="Rp"
                  className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2">Status</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Tersedia' })}
                    className={`px-8 py-3 rounded-xl font-bold text-base ${
                      formData.status === 'Tersedia'
                        ? 'bg-green-500 text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-700'
                    } hover:bg-green-600 hover:text-white`}
                  >
                    Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Tidak Tersedia' })}
                    className={`px-8 py-3 rounded-xl font-bold text-base ${
                      formData.status === 'Tidak Tersedia'
                        ? 'bg-red-500 text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-700'
                    } hover:bg-red-600 hover:text-white`}
                  >
                    Tidak Aktif
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                  onClick={handleCancel}
                  className="px-8 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-12 py-3 bg-green-500 text-white rounded-xl font-bold text-base hover:bg-green-600"
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
            <h1 className="text-5xl font-bold text-gray-900">Lapangan</h1>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Lapangan Aktif */}
          <div className="bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Lapangan Aktif</h3>
            <p className="text-7xl font-bold text-gray-900">{stats.lapangan_aktif}</p>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500 rounded-tl-full opacity-80"></div>
          </div>

          {/* Lapangan Non Aktif */}
          <div className="bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Lapangan Non Aktif</h3>
            <p className="text-7xl font-bold text-gray-900">{stats.lapangan_tidak_aktif}</p>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-500 rounded-tl-full opacity-80"></div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Daftar Lapangan</h3>
            <button 
              onClick={handleTambahClick}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl text-base font-bold hover:bg-green-600 shadow-lg"
            >
              <span className="text-xl">+</span> Tambah Lapangan
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : facilities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Belum ada data lapangan</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Nama Lapangan</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Jenis</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Harga Per Jam</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((facility) => (
                    <tr key={facility.id_lapangan} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-base text-gray-700">{facility.nama_lapangan}</td>
                      <td className="px-6 py-4 text-base text-gray-700">{facility.jenis}</td>
                      <td className="px-6 py-4 text-base text-gray-700">{formatRupiah(facility.harga)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-base font-bold ${
                          facility.status === 'Tersedia' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {facility.status === 'Tersedia' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleEdit(facility)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(facility.id_lapangan)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Showing {facilities.length} of {facilities.length} List</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Prev
              </button>
              <button className="w-10 h-10 rounded-lg bg-green-500 text-white font-bold">
                1
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Facilities;
