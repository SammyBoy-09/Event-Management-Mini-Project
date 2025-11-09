/**
 * 🧪 Push Notification Test Helper
 * 
 * This script helps you test push notifications by sending test notifications
 * to a specific Expo push token.
 * 
 * Usage:
 * 1. Get your Expo push token from the app console (starts with ExponentPushToken[...)
 * 2. Run: node testPushNotification.js YOUR_EXPO_PUSH_TOKEN
 * 
 * Example:
 * node testPushNotification.js ExponentPushToken[xxxxxxxxxxxxxx]
 */

const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

// Get token from command line arguments
const expoPushToken = process.argv[2];

if (!expoPushToken) {
  console.error('❌ Error: Please provide an Expo push token as an argument');
  console.log('\n📖 Usage: node testPushNotification.js YOUR_EXPO_PUSH_TOKEN');
  console.log('📖 Example: node testPushNotification.js ExponentPushToken[xxxxxxxxxxxxxx]');
  console.log('\n💡 Tip: Get your token from the app console after logging in');
  process.exit(1);
}

// Validate the token
if (!Expo.isExpoPushToken(expoPushToken)) {
  console.error('❌ Error: Invalid Expo push token format');
  console.log('✅ Valid format: ExponentPushToken[xxxxxxxxxxxxxx]');
  process.exit(1);
}

console.log('🚀 Sending test push notification...');
console.log('📱 To:', expoPushToken);

// Test notification scenarios
const testScenarios = [
  {
    name: 'RSVP Confirmation',
    notification: {
      to: expoPushToken,
      sound: 'default',
      title: 'RSVP Confirmed',
      body: 'You have successfully RSVP\'d to "Tech Talk 2024". See you on Nov 15!',
      data: { eventId: 'test-event-123', type: 'rsvp_confirmation' },
      priority: 'high',
    }
  },
  {
    name: 'Event Reminder (24 hours)',
    notification: {
      to: expoPushToken,
      sound: 'default',
      title: '📅 Event Tomorrow',
      body: '"Annual Hackathon" is happening tomorrow at 10:00 AM. Don\'t forget!',
      data: { eventId: 'test-event-456', type: 'event_reminder' },
      priority: 'high',
    }
  },
  {
    name: 'Event Reminder (1 hour)',
    notification: {
      to: expoPushToken,
      sound: 'default',
      title: '⏰ Event Starting Soon!',
      body: '"Workshop: React Native" is starting in 1 hour at 2:00 PM. Get ready!',
      data: { eventId: 'test-event-789', type: 'event_reminder' },
      priority: 'high',
    }
  },
  {
    name: 'Event Approval',
    notification: {
      to: expoPushToken,
      sound: 'default',
      title: '🎉 Event Approved',
      body: 'Your event "Music Festival 2024" has been approved and is now live!',
      data: { eventId: 'test-event-101', type: 'event_approval' },
      priority: 'high',
    }
  },
  {
    name: 'New RSVP (for creator)',
    notification: {
      to: expoPushToken,
      sound: 'default',
      title: '👥 New RSVP',
      body: 'John Doe has RSVP\'d to your event "Coding Workshop". 15/50 attendees.',
      data: { eventId: 'test-event-202', type: 'new_rsvp' },
      priority: 'high',
    }
  },
];

// Function to send a test notification
async function sendTestNotification(scenario) {
  try {
    console.log(`\n📤 Sending: ${scenario.name}`);
    
    const ticket = await expo.sendPushNotificationsAsync([scenario.notification]);
    
    console.log('✅ Sent successfully!');
    console.log('📋 Ticket:', JSON.stringify(ticket[0], null, 2));
    
    return ticket[0];
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return null;
  }
}

// Main function
async function main() {
  console.log('\n🧪 Testing Push Notifications\n');
  console.log('=' .repeat(50));
  
  // Ask user which test to run
  const testChoice = process.argv[3];
  
  if (testChoice) {
    const index = parseInt(testChoice) - 1;
    if (index >= 0 && index < testScenarios.length) {
      await sendTestNotification(testScenarios[index]);
    } else {
      console.log('❌ Invalid test number. Choose 1-5');
      displayMenu();
    }
  } else {
    // If no choice, show menu
    displayMenu();
    
    // Send first test by default after showing menu
    console.log('\n⏳ Sending test notification in 3 seconds...');
    setTimeout(async () => {
      await sendTestNotification(testScenarios[0]);
      console.log('\n✅ Test complete! Check your phone.');
      console.log('💡 To test other scenarios, run:');
      console.log('   node testPushNotification.js YOUR_TOKEN [1-5]');
    }, 3000);
  }
}

function displayMenu() {
  console.log('\n📋 Available Test Scenarios:');
  testScenarios.forEach((scenario, index) => {
    console.log(`   ${index + 1}. ${scenario.name}`);
  });
  console.log('\n💡 Usage: node testPushNotification.js YOUR_TOKEN [test_number]');
  console.log('💡 Example: node testPushNotification.js ExponentPushToken[xxx] 2');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
