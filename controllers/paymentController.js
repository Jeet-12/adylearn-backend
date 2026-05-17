const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Initiate payment (Upload screenshot)
// @route   POST /api/payments
// @access  Private
exports.initiatePayment = async (req, res) => {
    try {
        const { courseId, amount, transactionId } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a payment screenshot' });
        }

        // Check if there is already a pending payment
        const existingPayment = await Payment.findOne({ user: req.user.id, course: courseId, status: 'pending' });
        if (existingPayment) {
            return res.status(400).json({ success: false, message: 'You already have a pending payment for this course. Please wait for verification.' });
        }

        const payment = await Payment.create({
            user: req.user.id,
            course: courseId,
            amount,
            transactionId,
            screenshot: `/uploads/screenshots/${req.file.filename}`,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: payment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get user's payments
// @route   GET /api/payments/my
// @access  Private
exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id }).populate('course');
        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('user').populate('course');
        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Verify payment (Admin)
// @route   PUT /api/payments/:id/verify
// @access  Private/Admin
exports.verifyPayment = async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        payment.status = status;
        payment.adminNote = adminNote || '';
        await payment.save();

        if (status === 'approved') {
            // Grant access to user
            const user = await User.findById(payment.user);
            if (!user.purchasedCourses.includes(payment.course)) {
                user.purchasedCourses.push(payment.course);
                await user.save();

                // Increment student count for course
                await Course.findByIdAndUpdate(payment.course, { $inc: { studentsEnrolled: 1 } });
            }
        } else if (status === 'rejected') {
            // Revoke access if previously granted (just in case)
            const user = await User.findById(payment.user);
            if (user.purchasedCourses.includes(payment.course)) {
                user.purchasedCourses = user.purchasedCourses.filter(c => c.toString() !== payment.course.toString());
                await user.save();

                // Decrement student count
                await Course.findByIdAndUpdate(payment.course, { $inc: { studentsEnrolled: -1 } });
            }
        }

        res.status(200).json({ success: true, data: payment });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
