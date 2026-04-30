const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
    },
    order: {
        type: Number,
        default: 0
    }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Please add a thumbnail'],
    },
    instructor: {
        type: String,
        required: [true, 'Please add instructor info'],
    },
    playlist: [videoSchema],
    category: {
        type: String,
        default: 'General'
    },
    studentsEnrolled: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', courseSchema);
