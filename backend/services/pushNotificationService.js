const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send push notification to a single user
 * @param {string} expoPushToken - User's Expo push token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<object>} Result of push notification send
 */
const sendPushNotification = async (expoPushToken, title, body, data = {}) => {
  try {
    // Check if the push token is valid
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
      return {
        success: false,
        error: 'Invalid push token'
      };
    }

    // Construct the message
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      priority: 'high',
      channelId: 'default'
    };

    // Send the notification
    const ticket = await expo.sendPushNotificationsAsync([message]);
    
    console.log('Push notification sent:', ticket);
    
    return {
      success: true,
      ticket: ticket[0]
    };

  } catch (error) {
    console.error('Error sending push notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send push notifications to multiple users
 * @param {Array} notifications - Array of notification objects with expoPushToken, title, body, data
 * @returns {Promise<object>} Result of push notifications send
 */
const sendBulkPushNotifications = async (notifications) => {
  try {
    const messages = [];

    // Validate and prepare messages
    for (const notification of notifications) {
      const { expoPushToken, title, body, data = {} } = notification;

      // Check if the push token is valid
      if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data,
        priority: 'high',
        channelId: 'default'
      });
    }

    if (messages.length === 0) {
      console.log('No valid push tokens to send notifications to');
      return {
        success: false,
        error: 'No valid push tokens'
      };
    }

    // Split messages into chunks of 100 (Expo's recommended batch size)
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    // Send each chunk
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending chunk of push notifications:', error);
      }
    }

    console.log(`Sent ${tickets.length} push notifications`);

    return {
      success: true,
      tickets: tickets
    };

  } catch (error) {
    console.error('Error sending bulk push notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send push notification with event image
 * @param {string} expoPushToken - User's Expo push token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} imageUrl - Event image URL
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<object>} Result of push notification send
 */
const sendRichPushNotification = async (expoPushToken, title, body, imageUrl, data = {}) => {
  try {
    // Check if the push token is valid
    if (!Expo.isExpoPushToken(expoPushToken)) {
      console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
      return {
        success: false,
        error: 'Invalid push token'
      };
    }

    // Construct the message with image
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: {
        ...data,
        imageUrl: imageUrl
      },
      priority: 'high',
      channelId: 'default',
      // Add image for Android rich notifications
      ...(imageUrl && {
        android: {
          imageUrl: imageUrl,
          largeIcon: imageUrl
        }
      })
    };

    // Send the notification
    const ticket = await expo.sendPushNotificationsAsync([message]);
    
    console.log('Rich push notification sent:', ticket);
    
    return {
      success: true,
      ticket: ticket[0]
    };

  } catch (error) {
    console.error('Error sending rich push notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendPushNotification,
  sendBulkPushNotifications,
  sendRichPushNotification
};
