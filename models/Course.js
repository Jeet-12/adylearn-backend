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
    discountPrice: {
        type: Number,
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
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
        default: 'Beginner'
    },
    duration: {
        type: String,
        default: '10 Hours'
    },
    certification: {
        type: String,
        default: 'Verified Certificate'
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
