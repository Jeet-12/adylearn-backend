const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
    .get(getSettings)
    .put(protect, authorize('admin'), upload.single('qrCodeImage'), updateSettings);

module.exports = router;
