import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      if (response.success) {
        toast.success(response.message || 'Login berhasil!');
        
        // Redirect ke dashboard admin atau home user
        // Sesuaikan dengan role jika ada
        navigate('/admin'); // atau navigate('/') untuk user biasa
      } else {
        toast.error(response.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle error dari backend
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Terjadi kesalahan saat login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400">
      {/* Background Blur Effects */}
      <div 
        className="absolute top-[-40%] left-[20%] w-[400px] h-[400px] rounded-full blur-[20px] opacity-90"
        style={{
          background: 'radial-gradient(circle, #D7FF00 0%, rgba(215,255,0,0.5) 50%, transparent 100%)',
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[60px] opacity-80"
        style={{
          background: 'radial-gradient(circle, #D7FF00 0%, rgba(215,255,0,0.4) 70%, transparent 100%)',
        }}
      />
      <div 
        className="absolute bottom-[-20%] right-[75%] w-[400px] h-[400px] rounded-full blur-[40px] opacity-90"
        style={{
          background: 'radial-gradient(circle, #D7FF00 0%, rgba(215,255,0,0.4) 70%, transparent 100%)',
        }}
      />

      {/* Login Card */}
      <div className="relative z-10">
        {/* Title */}
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Login</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full min-w-[400px] pl-12 pr-4 py-4 bg-white/90 border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D7FF00] focus:border-transparent transition-all"
                required
                disabled={loading}
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full min-w-[400px] pl-12 pr-4 py-4 bg-white/90 border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D7FF00] focus:border-transparent transition-all"
                required
                disabled={loading}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full font-semibold text-gray-800 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#1DD028',
            }}
          >
            {loading ? 'Loading...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;