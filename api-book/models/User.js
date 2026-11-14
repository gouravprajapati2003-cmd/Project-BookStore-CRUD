const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String
    },
    mobileNo: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    profilePhoto: {
      type: String
    },
    lastLogin: {
      type: Date
    },
    userType: {
      type: String,
      default: 'user',
      enum: ['user', 'admin']
    },
    isSuperAdmin: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'Inactive']
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
