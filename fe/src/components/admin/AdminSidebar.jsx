import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import dashboardIcon from '../../assets/icons/dashboard.svg';
import bookingIcon from '../../assets/icons/booking.png';
import facilityIcon from '../../assets/icons/lapangan.svg';
import reportIcon from '../../assets/icons/laporan.svg'; 

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: dashboardIcon,
      path: '/admin',
    },
    {
      name: 'Booking',
      icon: bookingIcon,
      path: '/admin/bookings',
    },
    {
      name: 'Lapangan',
      icon: facilityIcon,
      path: '/admin/facilities',
    },
    {
      name: 'Laporan',
      icon: reportIcon,
      path: '/admin/payments',
    },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-56 bg-white rounded-[3.5rem] m-5 shadow-xl flex flex-col h-[calc(80vh-2rem)] mt-12">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-center">
          Queen<span className="font-normal">SportHall</span>
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-10">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-full font-semibold text-base transition-all ${
                active
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <img 
                src={item.icon} 
                alt={item.name}
                className={`w-6 h-6 ${active ? 'brightness-0 invert' : ''}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-100 rounded-full font-semibold text-base transition-all w-full"
        >
          <LogOut size={24} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;