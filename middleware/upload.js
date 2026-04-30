const multer = require('multer');
const path = require('path');

const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
    'uploads/thumbnails',
    'uploads/videos',
    'uploads/screenshots'
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = 'uploads/';
        if (file.fieldname === 'thumbnail') {
            dest += 'thumbnails/';
        } else if (file.fieldname === 'video') {
            dest += 'videos/';
        } else if (file.fieldname === 'screenshot') {
            dest += 'screenshots/';
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images and Videos Only!'), false);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 }, // 1GB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
