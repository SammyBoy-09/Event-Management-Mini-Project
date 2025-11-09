const cron = require('node-cron');
const Event = require('../models/Event');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const { sendPushNotification, sendRichPushNotification } = require('./pushNotificationService');

/**
 * Send reminders for events happening in 24 hours
 * Runs every hour at minute 0
 */
const sendDayBeforeReminders = cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running 24-hour reminder check...');

    // Get current time and 24 hours from now
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twentyFiveHoursLater = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Find events happening in the next 24-25 hours (1-hour window)
    const upcomingEvents = await Event.find({
      date: {
        $gte: twentyFourHoursLater,
        $lt: twentyFiveHoursLater,
      },
      status: 'approved',
    }).populate('attendees.student', 'name email expoPushToken');

    console.log(`Found ${upcomingEvents.length} events for 24-hour reminders`);

    // Send reminders to all attendees
    for (const event of upcomingEvents) {
      if (event.attendees.length === 0) continue;

      const attendeeIds = event.attendees
        .filter((att) => att.student != null)
        .map((att) => att.student._id);

      // Create in-app notifications
      const notifications = event.attendees
        .filter((att) => att.student != null)
        .map((att) => ({
          recipient: att.student._id,
          type: 'event_reminder',
          title: 'Event Reminder',
          message: `"${event.title}" is happening tomorrow at ${event.time}. Don't forget!`,
          relatedEvent: event._id,
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} reminder notifications for event: ${event.title}`);
      }

      // Send push notifications
      const pushNotifications = event.attendees
        .filter((att) => att.student && att.student.expoPushToken)
        .map((att) => ({
          expoPushToken: att.student.expoPushToken,
          title: '📅 Event Tomorrow',
          body: `"${event.title}" is happening tomorrow at ${event.time}. Don't forget!`,
          data: { eventId: event._id.toString(), type: 'event_reminder' },
        }));

      if (pushNotifications.length > 0) {
        const { sendBulkPushNotifications } = require('./pushNotificationService');
        await sendBulkPushNotifications(pushNotifications);
        console.log(`Sent ${pushNotifications.length} push reminders for event: ${event.title}`);
      }
    }

    console.log('24-hour reminder check completed');
  } catch (error) {
    console.error('Error in day-before reminders:', error);
  }
});

/**
 * Send reminders for events happening in 1 hour
 * Runs every 10 minutes
 */
const sendOneHourBeforeReminders = cron.schedule('*/10 * * * *', async () => {
  try {
    console.log('Running 1-hour reminder check...');

    // Get current time and 1 hour from now
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const seventyMinutesLater = new Date(now.getTime() + 70 * 60 * 1000);

    // Find events happening in the next 1-1.17 hours (10-minute window)
    const upcomingEvents = await Event.find({
      date: {
        $gte: oneHourLater,
        $lt: seventyMinutesLater,
      },
      status: 'approved',
    }).populate('attendees.student', 'name email expoPushToken');

    console.log(`Found ${upcomingEvents.length} events for 1-hour reminders`);

    // Send reminders to all attendees
    for (const event of upcomingEvents) {
      if (event.attendees.length === 0) continue;

      const attendeeIds = event.attendees
        .filter((att) => att.student != null)
        .map((att) => att.student._id);

      // Create in-app notifications
      const notifications = event.attendees
        .filter((att) => att.student != null)
        .map((att) => ({
          recipient: att.student._id,
          type: 'event_reminder',
          title: 'Event Starting Soon!',
          message: `"${event.title}" is starting in 1 hour at ${event.time}. Get ready!`,
          relatedEvent: event._id,
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} 1-hour reminder notifications for event: ${event.title}`);
      }

      // Send push notifications
      const pushNotifications = event.attendees
        .filter((att) => att.student && att.student.expoPushToken)
        .map((att) => ({
          expoPushToken: att.student.expoPushToken,
          title: '⏰ Event Starting Soon!',
          body: `"${event.title}" is starting in 1 hour at ${event.time}. Get ready!`,
          data: { eventId: event._id.toString(), type: 'event_reminder' },
        }));

      if (pushNotifications.length > 0) {
        const { sendBulkPushNotifications } = require('./pushNotificationService');
        await sendBulkPushNotifications(pushNotifications);
        console.log(`Sent ${pushNotifications.length} 1-hour push reminders for event: ${event.title}`);
      }
    }

    console.log('1-hour reminder check completed');
  } catch (error) {
    console.error('Error in 1-hour reminders:', error);
  }
});

/**
 * Start all reminder cron jobs
 */
const startReminderJobs = () => {
  console.log('Starting reminder cron jobs...');
  sendDayBeforeReminders.start();
  sendOneHourBeforeReminders.start();
  console.log('Reminder cron jobs started successfully');
  console.log('- 24-hour reminders: Every hour at minute 0');
  console.log('- 1-hour reminders: Every 10 minutes');
};

/**
 * Stop all reminder cron jobs
 */
const stopReminderJobs = () => {
  console.log('Stopping reminder cron jobs...');
  sendDayBeforeReminders.stop();
  sendOneHourBeforeReminders.stop();
  console.log('Reminder cron jobs stopped');
};

module.exports = {
  startReminderJobs,
  stopReminderJobs,
};
