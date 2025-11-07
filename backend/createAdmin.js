/**
 * Script to create an admin user in MongoDB
 * Run this script using: node createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');

// MongoDB connection (using MONGO_URI from .env)
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'your-mongodb-connection-string';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Hash the password
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Admin user details
    const adminData = {
      name: 'Admin User',
      usn: 'ADMIN001',
      email: 'admin@campusconnect.com',
      password: hashedPassword, // Use hashed password
      year: 4,
      semester: 8,
      phone: '1234567890',
      gender: 'Male',
      department: 'Administration',
      role: 'admin' // This is the important part!
    };

    // Check if admin already exists
    const existingAdmin = await Student.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email);
      console.log('Existing admin details:');
      console.log('  Name:', existingAdmin.name);
      console.log('  Email:', existingAdmin.email);
      console.log('  USN:', existingAdmin.usn);
      console.log('  Role:', existingAdmin.role);
      
      // Option to update existing user to admin
      console.log('\n💡 To make an existing user an admin, update their role in MongoDB Atlas:');
      console.log('   db.students.updateOne({ email: "user@email.com" }, { $set: { role: "admin" } })');
      
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    console.log('Creating admin user...');
    const admin = await Student.create(adminData);
    
    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Admin Account Details:');
    console.log('   Name:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   USN:', admin.usn);
    console.log('   Password: admin123');
    console.log('   Role:', admin.role);
    
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   1. Change the password after first login!');
    console.log('   2. Use a strong password in production');
    console.log('   3. Do not share admin credentials');
    
    console.log('\n🔐 Login credentials:');
    console.log('   Email: admin@campusconnect.com');
    console.log('   Password: admin123');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.error('Duplicate key error - User with this email or USN already exists');
    }
    process.exit(1);
  }
};

// Run the script
console.log('🚀 Starting admin user creation script...\n');
createAdminUser();
