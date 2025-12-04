const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv =require('dotenv');
const User = require('./models/User.js'); 


dotenv.config();

const createAdmin = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = "b129162112@gmail.com";
    const adminPassword = "BipulRaj@123";
    const adminMobile = "9155420942";

    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('An admin with this email already exists.');
      mongoose.disconnect();
      return;
    }

    
    const adminUser = new User({
      email: adminEmail,
      password: adminPassword, 
      role: 'admin',
      isFirstLogin: false, 
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    
    mongoose.disconnect();
  }
};


createAdmin();