// controllers/userController.js
const User = require('../models/User.js');

const setInitialPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.password = password;
      user.isFirstLogin = false;
      await user.save();

      res
        .status(200)
        .json({ message: 'Password updated successfully. Please log in again.' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error setting initial password:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { setInitialPassword };
