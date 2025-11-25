// controllers/authController.js
const User = require('../models/User.js');
const generateToken = require('../utils/generateToken.js');

// POST /api/auth/initial-setup
// Create first admin account ONLY if no users exist
const initialSetup = async (req, res) => {
  console.log('🔹 initialSetup controller called');
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const userCount = await User.countDocuments();
    console.log('🔹 Existing user count:', userCount);

    if (userCount > 0) {
      return res
        .status(400)
        .json({ message: 'Setup already completed. Please login.' });
    }

    await User.create({
      email,
      password,
      role: 'admin',
      isFirstLogin: false,
    });

    console.log('🔹 Admin user created successfully');

    return res
      .status(201)
      .json({ message: 'Admin account created successfully. Please login.' });
  } catch (error) {
    console.error('❌ Initial setup error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  console.log('🔹 loginUser controller called');
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);

      return res.status(200).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        token: token,
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { loginUser, initialSetup };
