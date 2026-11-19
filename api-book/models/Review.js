const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    userName: {
      type: String,
      required: true,
      trim: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },

    helpfulCount: {
      type: Number,
      default: 0
    },

    helpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    status: {
      type: String,
      enum: ['Active', 'Hidden'],
      default: 'Active'
    }
  },
  { timestamps: true }
)

// Ek user ek book par sirf ek review de sakega
reviewSchema.index({ book: 1, userId: 1 }, { unique: true })

// Book reviews ko efficiently fetch karne ke liye
reviewSchema.index({ book: 1, status: 1, createdAt: -1 })

module.exports = mongoose.model('Review', reviewSchema)
