const Setting = require('../models/Setting');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne();
        if (!setting) {
            setting = await Setting.create({});
        }
        res.status(200).json({ success: true, data: setting });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
    try {
        const { upiId } = req.body;
        
        let setting = await Setting.findOne();
        if (!setting) {
            setting = new Setting();
        }

        if (upiId) setting.upiId = upiId;
        
        if (req.file) {
            setting.qrCodeImage = `/uploads/screenshots/${req.file.filename}`; // reusing the upload directory
        }

        await setting.save();
        res.status(200).json({ success: true, data: setting });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
