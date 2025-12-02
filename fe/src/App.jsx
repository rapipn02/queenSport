import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

// User Pages
import Home from './pages/user/Home'
import UserLogin from './pages/user/Login'
import Facilities from './pages/user/Facilities'
import Booking from './pages/user/Booking'
import BookingSchedule from './pages/user/BookingSchedule'
import BookingDetail from './pages/user/BookingDetail'
import Payment from './pages/user/Payment'
import PaymentSuccess from './pages/user/PaymentSuccess'
import MyBookings from './pages/user/MyBookings'
import Landing from './pages/user/Landing'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminBookings from './pages/admin/Bookings'
import AdminFacilities from './pages/admin/Facilities'
import AdminPayments from './pages/admin/Payments'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-schedule" element={<BookingSchedule />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
         
          <Route path="/booking/:facilityId" element={<Booking />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/facilities" element={<AdminFacilities />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App 