const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRSVP,
  approveEvent,
  rejectEvent,
  updateEventStatus,
  markAttendance
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Event CRUD
router.post('/', createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// RSVP
router.post('/:id/rsvp', rsvpEvent);
router.delete('/:id/rsvp', cancelRSVP);

// Admin actions
router.put('/:id/approve', approveEvent);
router.put('/:id/reject', rejectEvent);
router.put('/:id/status', updateEventStatus);

// Attendance
router.put('/:eventId/attendance/:studentId', markAttendance);

module.exports = router;
