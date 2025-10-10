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

module.exports = { loginUser };