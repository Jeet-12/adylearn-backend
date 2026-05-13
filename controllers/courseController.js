const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
    try {
        const courseData = { ...req.body };
        if (req.file) {
            courseData.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
        }
        
        const course = await Course.create(courseData);
        res.status(201).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const courseData = { ...req.body };
        if (req.file) {
            courseData.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
        }

        course = await Course.findByIdAndUpdate(req.params.id, courseData, {
            returnDocument: 'after',
            runValidators: true,
        });

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        await course.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Add video to course playlist
// @route   POST /api/courses/:id/videos
// @access  Private/Admin
exports.addVideo = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const videoData = {
            title: req.body.title,
            videoUrl: `/uploads/videos/${req.file.filename}`,
            videoUrl_144: `/uploads/videos/${req.file.filename}`, // Placeholder
            videoUrl_360: `/uploads/videos/${req.file.filename}`, // Placeholder
            videoUrl_1080: `/uploads/videos/${req.file.filename}`, // Placeholder
            duration: req.body.duration || '0:00',
            order: course.playlist.length
        };

        course.playlist.push(videoData);
        await course.save();

        res.status(200).json({ success: true, data: course });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.reorderPlaylist = async (req, res) => {
    try {
        const { playlist } = req.body;
        
        if (!playlist || !Array.isArray(playlist)) {
            return res.status(400).json({ success: false, message: 'Invalid playlist data' });
        }

        // Sanitize and re-index the playlist, stripping old IDs to force a clean re-insertion in order
        const sanitizedPlaylist = playlist.map((video, index) => ({
            title: video.title,
            videoUrl: video.videoUrl,
            duration: video.duration || '0:00',
            order: index
        }));

        // Force a direct update in MongoDB bypassing Mongoose save logic
        const result = await Course.updateOne(
            { _id: req.params.id },
            { $set: { playlist: sanitizedPlaylist } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Fetch the updated course to return to frontend
        const updatedCourse = await Course.findById(req.params.id);

        res.status(200).json({ success: true, data: updatedCourse });
    } catch (err) {
        console.error('DATABASE UPDATE ERROR:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};
