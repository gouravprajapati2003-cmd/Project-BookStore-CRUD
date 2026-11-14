const mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    userType: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
      default: 'user'
    },
    isSuperAdmin: {
      type: Boolean,
      default: false
    },
    otpHash: {
      type: String,
      default: null
    },
    otpExpiresAt: {
      type: Date,
      default: null
    },
    attempts: {
      type: Number,
      default: 0
    },
    resendAvailableAt: {
      type: Date,
      default: null
    },
    resetTokenHash: {
      type: String,
      default: null
    },
    resetTokenExpiresAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('PasswordReset', passwordResetSchema)
