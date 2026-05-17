const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    upiId: {
        type: String,
        default: 'adylearn@upi'
    },
    qrCodeImage: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
