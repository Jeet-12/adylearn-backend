const express = require('express');
const {
    initiatePayment,
    getMyPayments,
    getAllPayments,
    verifyPayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllPayments)
    .post(protect, upload.single('screenshot'), initiatePayment);

router.get('/my', protect, getMyPayments);
router.put('/:id/verify', protect, authorize('admin'), verifyPayment);

module.exports = router;
