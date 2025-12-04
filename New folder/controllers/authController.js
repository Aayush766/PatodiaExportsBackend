const User = require('../models/User.js');
const generateToken = require('../utils/generateToken.js');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id);

            res.status(200).json({
                _id: user._id,
                email: user.email,
                role: user.role,
                isFirstLogin: user.isFirstLogin,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// ✅ EMAIL-BASED RESET FLOW

// POST /api/auth/forgot-password
// Step 1: user enters email, we send OTP to email
const sendResetOtp = async (req, res) => {
  console.log('🔹 sendResetOtp (email) called');
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'No user found with this email address' });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.resetOtpVerified = false;
    await user.save();

    // Send OTP via email
    await sendEmail({
      to: user.email,
      subject: 'PatodiaExports Admin - Password Reset OTP',
      text: `Your OTP for resetting your password is: ${otp}. It is valid for 10 minutes.`,
    });

    console.log(`🔹 OTP for ${email}: ${otp}`);

    return res.status(200).json({
      message: 'OTP sent to your email address',
      // ⚠️ do NOT send otp in production response
      // otp, // uncomment only for local testing if needed
    });
  } catch (error) {
    console.error('❌ sendResetOtp error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/auth/verify-reset-otp
// Step 2: verify OTP
const verifyResetOtp = async (req, res) => {
  console.log('🔹 verifyResetOtp called');
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'No user found with this email address' });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'No active OTP request found' });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: 'OTP has expired, please request a new one' });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.resetOtpVerified = true;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('❌ verifyResetOtp error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/auth/reset-password
// Step 3: set new password (after OTP verified)
const resetPasswordWithOtp = async (req, res) => {
  console.log('🔹 resetPasswordWithOtp called');
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'No user found with this email address' });
    }

    if (!user.resetOtpVerified) {
      return res
        .status(400)
        .json({ message: 'OTP not verified. Please verify OTP first.' });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: 'OTP has expired, please request a new one' });
    }

    user.password = password;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    user.resetOtpVerified = false;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Password reset successful. Please login.' });
  } catch (error) {
    console.error('❌ resetPasswordWithOtp error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  loginUser,
  initialSetup,
  sendResetOtp,
  verifyResetOtp,
  resetPasswordWithOtp,
};
