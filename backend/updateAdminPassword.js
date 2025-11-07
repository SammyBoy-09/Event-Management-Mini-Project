/**
 * Script to update admin password to hashed version
 * Run this script using: node updateAdminPassword.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const updateAdminPassword = async () => {
  try {
    console.log('🔐 Updating admin password to hashed version...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Hash the password
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('✅ Password hashed successfully');

    // Update admin user
    const result = await Student.updateOne(
      { email: 'admin@campusconnect.com' },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      console.log('\n✅ Admin password updated successfully!');
      console.log('\n🔐 Login credentials:');
      console.log('   Email: admin@campusconnect.com');
      console.log('   Password: admin123');
      console.log('\n✨ You can now login with these credentials!');
    } else {
      console.log('\n⚠️  Admin user not found or password already updated');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error updating admin password:', error.message);
    process.exit(1);
  }
};

updateAdminPassword();
