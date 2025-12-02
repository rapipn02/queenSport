export const ROUTES = {
  // User routes
  USER: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FACILITIES: '/facilities',
    FACILITY_DETAIL: '/facilities/:id',
    BOOKING: '/booking/:facilityId',
    PAYMENT: '/payment/:bookingId',
    PAYMENT_SUCCESS: '/payment/success',
    MY_BOOKINGS: '/my-bookings',
    PROFILE: '/profile',
  },
  
  // Admin routes
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin',
    BOOKINGS: '/admin/bookings',
    BOOKING_DETAIL: '/admin/bookings/:id',
    FACILITIES: '/admin/facilities',
    SCHEDULE: '/admin/schedule',
    USERS: '/admin/users',
    PAYMENTS: '/admin/payments',
    REPORTS: '/admin/reports',
  },
};
