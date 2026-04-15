const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: [true, 'Tag value is required'],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [1, 'Tag must be at least 1 character'],
            maxlength: [50, 'Tag cannot exceed 50 characters'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tag', tagSchema);
