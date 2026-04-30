const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();
        const approvedPayments = await Payment.find({ status: 'approved' });
        const totalRevenue = approvedPayments.reduce((acc, curr) => acc + curr.amount, 0);

        // Get recent payments
        const recentPayments = await Payment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .populate('course', 'title');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalCourses,
                totalRevenue,
                recentPayments
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
