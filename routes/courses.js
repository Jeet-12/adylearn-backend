const express = require('express');
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    addVideo,
    reorderPlaylist
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Specific routes first
router.post('/:id/videos', protect, authorize('admin'), upload.single('video'), addVideo);
router.put('/:id/reorder-playlist', protect, authorize('admin'), reorderPlaylist);

// General collection routes
router.get('/', getCourses);
router.post('/', protect, authorize('admin'), upload.single('thumbnail'), createCourse);

// Single resource routes last
router.get('/:id', getCourse);
router.put('/:id', protect, authorize('admin'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
