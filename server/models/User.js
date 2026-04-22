const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
            index: {
                collation: { locale: 'en', strength: 2 }
            }
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Ensure provided email is valid'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        tags: [{
            type: String
        }],
        verified: {
            type: Boolean,
            default: false
        },
        verificationToken: {
            type: String,
            select: false
        },
        passwordResetToken: {
            type: String,
            select: false
        },
        passwordResetExpiry: {
            type: Date,
            select: false
        },
        firstName: {
            type: String,
            required: [true, 'First Name is required']
        },
        lastName: {
            type: String,
            required: [true, 'Last Name is required']
        },
        bio: {
            type: String
        },
        profilePicture: {
            type: String
        }
    },
    { timestamps: true }
)

// hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

// password compared with hash
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}


module.exports = mongoose.model('User', userSchema)
