// createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.js');

dotenv.config();

const createAdmin = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = "b129162112@gmail.com";
    const adminPassword = "BipulRaj@123";
    const adminMobile = "9155420942";

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("❌ Admin with this email already exists. No changes made.");
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: adminEmail,
      mobile: adminMobile,
      password: adminPassword,
      role: 'admin',
      isFirstLogin: false,
    });

    await adminUser.save();

    console.log("🎉 Admin created successfully!");
    console.log("--------------------------------------");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Mobile: ${adminMobile}`);
    console.log("--------------------------------------");
    console.log("🔐 Password has been securely hashed.");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
