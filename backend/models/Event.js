const mongoose = require('mongoose');

/**
 * Event Schema
 * Defines the structure for event data in MongoDB
 */
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    minlength: [20, 'Description must be at least 20 characters long']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time in HH:MM format']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  organizer: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['Technology', 'Sports', 'Cultural', 'Academic', 'Workshop', 'Seminar', 'Competition', 'Social', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  },
  image: {
    type: String,
    default: null
  },
  maxAttendees: {
    type: Number,
    required: [true, 'Maximum attendees is required'],
    min: [1, 'Must allow at least 1 attendee'],
    max: [10000, 'Maximum attendees cannot exceed 10,000']
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  attendees: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    rsvpDate: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    },
    attendedAt: {
      type: Date,
      default: null
    },
    checkInMethod: {
      type: String,
      enum: ['qr-scan', 'manual'],
      default: null
    }
  }],
  rsvpRequired: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ createdBy: 1 });

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.currentAttendees >= this.maxAttendees;
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return new Date(this.date) > new Date();
});

module.exports = mongoose.model('Event', eventSchema);
