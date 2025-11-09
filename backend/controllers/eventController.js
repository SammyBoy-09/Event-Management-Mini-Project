const Event = require('../models/Event');
const Student = require('../models/Student');
const Notification = require('../models/Notification');

/**
 * Create a new event
 * POST /api/events
 */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
      image,
      maxAttendees,
      rsvpRequired,
      isPublic,
      tags
    } = req.body;

    // Validate date is in future
    const eventDate = new Date(date);
    if (eventDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be in the future'
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
      image,
      maxAttendees,
      rsvpRequired,
      isPublic,
      tags,
      createdBy: req.student.id,
      status: 'pending' // Events require admin approval
    });

    // Populate creator info
    await event.populate('createdBy', 'name email usn');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

/**
 * Get all events with filters
 * GET /api/events
 */
exports.getAllEvents = async (req, res) => {
  try {
    const {
      category,
      status,
      search,
      startDate,
      endDate,
      upcoming,
      myEvents,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status filter with proper moderation logic
    if (req.student.role === 'admin' || req.student.role === 'cr' || req.student.role === 'CR') {
      // Admins and CRs can filter by status (see all events)
      if (status) {
        query.status = status;
      }
      // If no status filter, admins see all events (pending, approved, rejected)
    } else {
      // Regular users ONLY see approved events (strict moderation)
      query.status = 'approved';
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Upcoming events only
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    // My events (created by user)
    if (myEvents === 'true') {
      query.createdBy = req.student.id;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(query)
      .populate('createdBy', 'name email usn role')
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

/**
 * Get event by ID
 * GET /api/events/:id
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email usn role phone')
      .populate('attendees.student', 'name email usn');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if current user has RSVP'd (only if user is authenticated)
    const hasRSVP = req.student && req.student.id 
      ? event.attendees.some(att => att.student && att.student._id.toString() === req.student.id)
      : false;

    res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        hasRSVP
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

/**
 * Update event
 * PUT /api/events/:id
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions (creator or admin)
    if (event.createdBy.toString() !== req.student.id && req.student.role !== 'admin' && req.student.role !== 'cr' && req.student.role !== 'CR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Update fields
    const allowedUpdates = [
      'title', 'description', 'date', 'time', 'location',
      'organizer', 'category', 'image', 'maxAttendees',
      'rsvpRequired', 'isPublic', 'tags'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    // Notify all attendees about update
    if (event.attendees.length > 0) {
      const notifications = event.attendees
        .filter(att => att.student != null) // Filter out null student references
        .map(att => ({
          recipient: att.student,
          type: 'event_update',
          title: 'Event Updated',
          message: `The event "${event.title}" has been updated. Please check the new details.`,
          relatedEvent: event._id
        }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

/**
 * Delete event
 * DELETE /api/events/:id
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions (creator or admin)
    if (event.createdBy.toString() !== req.student.id && req.student.role !== 'admin' && req.student.role !== 'cr' && req.student.role !== 'CR') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await event.deleteOne();

    // Remove event from all students' registeredEvents
    await Student.updateMany(
      { registeredEvents: event._id },
      { $pull: { registeredEvents: event._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

/**
 * RSVP to event
 * POST /api/events/:id/rsvp
 */
exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is approved
    if (event.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot RSVP to unapproved event'
      });
    }

    // Check if event is full
    if (event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if already RSVP'd
    const alreadyRSVP = event.attendees.some(
      att => att.student.toString() === req.student.id
    );

    if (alreadyRSVP) {
      return res.status(400).json({
        success: false,
        message: 'Already RSVP\'d to this event'
      });
    }

    // Add RSVP
    event.attendees.push({
      student: req.student.id,
      rsvpDate: new Date()
    });
    event.currentAttendees += 1;
    await event.save();

    // Add event to student's registeredEvents
    await Student.findByIdAndUpdate(req.student.id, {
      $addToSet: { registeredEvents: event._id }
    });

    // Create notification
    await Notification.create({
      recipient: req.student.id,
      type: 'rsvp_confirmation',
      title: 'RSVP Confirmed',
      message: `You have successfully RSVP'd to "${event.title}". See you on ${new Date(event.date).toLocaleDateString()}!`,
      relatedEvent: event._id
    });

    res.status(200).json({
      success: true,
      message: 'RSVP successful',
      data: event
    });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing RSVP',
      error: error.message
    });
  }
};

/**
 * Cancel RSVP
 * DELETE /api/events/:id/rsvp
 */
exports.cancelRSVP = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if RSVP exists
    const rsvpIndex = event.attendees.findIndex(
      att => att.student.toString() === req.student.id
    );

    if (rsvpIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'No RSVP found for this event'
      });
    }

    // Remove RSVP
    event.attendees.splice(rsvpIndex, 1);
    event.currentAttendees -= 1;
    await event.save();

    // Remove event from student's registeredEvents
    await Student.findByIdAndUpdate(req.student.id, {
      $pull: { registeredEvents: event._id }
    });

    res.status(200).json({
      success: true,
      message: 'RSVP cancelled successfully',
      data: event
    });
  } catch (error) {
    console.error('Cancel RSVP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling RSVP',
      error: error.message
    });
  }
};

/**
 * Approve event (Admin only)
 * PUT /api/events/:id/approve
 */
exports.approveEvent = async (req, res) => {
  try {
    if (req.student.role !== 'admin' && req.student.role !== 'cr' && req.student.role !== 'CR') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and CRs can approve events'
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.status = 'approved';
    event.approvedBy = req.student.id;
    event.approvedAt = new Date();
    await event.save();

    // Notify event creator
    await Notification.create({
      recipient: event.createdBy,
      type: 'event_approval',
      title: 'Event Approved',
      message: `Your event "${event.title}" has been approved and is now live!`,
      relatedEvent: event._id
    });

    res.status(200).json({
      success: true,
      message: 'Event approved successfully',
      data: event
    });
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving event',
      error: error.message
    });
  }
};

/**
 * Reject event (Admin only)
 * PUT /api/events/:id/reject
 */
exports.rejectEvent = async (req, res) => {
  try {
    if (req.student.role !== 'admin' && req.student.role !== 'cr' && req.student.role !== 'CR') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and CRs can reject events'
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.status = 'rejected';
    await event.save();

    // Notify event creator
    await Notification.create({
      recipient: event.createdBy,
      type: 'event_rejection',
      title: 'Event Rejected',
      message: `Your event "${event.title}" has been rejected. ${req.body.reason || ''}`,
      relatedEvent: event._id
    });

    res.status(200).json({
      success: true,
      message: 'Event rejected successfully',
      data: event
    });
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting event',
      error: error.message
    });
  }
};

/**
 * Update event status (Admin/CR only)
 * PUT /api/events/:id/status
 */
exports.updateEventStatus = async (req, res) => {
  try {
    if (req.student.role !== 'admin' && req.student.role !== 'cr' && req.student.role !== 'CR') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and CRs can update event status'
      });
    }

    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const oldStatus = event.status;
    event.status = status;

    if (status === 'approved') {
      event.approvedBy = req.student.id;
      event.approvedAt = new Date();
    }

    await event.save();

    // Notify event creator if status changed
    if (oldStatus !== status) {
      let notificationMessage = '';
      let notificationType = '';

      if (status === 'approved') {
        notificationMessage = `Your event "${event.title}" has been approved and is now live!`;
        notificationType = 'event_approval';
      } else if (status === 'rejected') {
        notificationMessage = `Your event "${event.title}" has been rejected. ${req.body.reason || ''}`;
        notificationType = 'event_rejection';
      } else if (status === 'pending') {
        notificationMessage = `Your event "${event.title}" status has been changed to pending review.`;
        notificationType = 'event_status_change';
      }

      await Notification.create({
        recipient: event.createdBy,
        type: notificationType,
        title: 'Event Status Updated',
        message: notificationMessage,
        relatedEvent: event._id
      });
    }

    res.status(200).json({
      success: true,
      message: `Event status updated to ${status}`,
      data: event
    });
  } catch (error) {
    console.error('Update event status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event status',
      error: error.message
    });
  }
};

/**
 * Mark attendance (Admin/CR only)
 * PUT /api/events/:eventId/attendance/:studentId
 */
exports.markAttendance = async (req, res) => {
  try {
    if (req.student.role !== 'admin' && req.student.role !== 'cr' && req.student.role !== 'CR') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and CRs can mark attendance'
      });
    }

    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find attendee
    const attendee = event.attendees.find(
      att => att.student.toString() === req.params.studentId
    );

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Student not registered for this event'
      });
    }

    // Toggle or set attendance
    const newAttendedStatus = req.body.attended !== undefined ? req.body.attended : !attendee.attended;
    attendee.attended = newAttendedStatus;
    
    // Set timestamp and method if marking as attended
    if (newAttendedStatus) {
      attendee.attendedAt = new Date();
      attendee.checkInMethod = req.body.checkInMethod || 'manual';
    } else {
      // Clear timestamp if unmarking
      attendee.attendedAt = null;
      attendee.checkInMethod = null;
    }
    
    await event.save();

    // Populate student details for response
    await event.populate('attendees.student', 'name email usn');

    res.status(200).json({
      success: true,
      message: `Attendance ${newAttendedStatus ? 'marked' : 'unmarked'} successfully`,
      data: event
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

/**
 * Get event attendees with attendance details
 * GET /api/events/:eventId/attendees
 */
exports.getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('attendees.student', 'name email usn phone department')
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has permission to view attendees
    const isCreator = event.createdBy && event.createdBy._id.toString() === req.student.id;
    const isAdmin = req.student.role === 'admin' || req.student.role === 'cr' || req.student.role === 'CR';
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view attendees'
      });
    }

    // Filter out attendees with null student references
    const validAttendees = event.attendees.filter(a => a.student != null);

    // Calculate attendance statistics
    const totalRSVPs = validAttendees.length;
    const attendedCount = validAttendees.filter(a => a.attended).length;
    const pendingCount = totalRSVPs - attendedCount;
    const attendanceRate = totalRSVPs > 0 ? ((attendedCount / totalRSVPs) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        event: {
          id: event._id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          status: event.status
        },
        attendees: validAttendees,
        statistics: {
          totalRSVPs,
          attendedCount,
          pendingCount,
          attendanceRate: parseFloat(attendanceRate)
        }
      }
    });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendees',
      error: error.message
    });
  }
};
