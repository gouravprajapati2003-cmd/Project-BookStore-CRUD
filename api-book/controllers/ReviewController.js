const Review = require('../models/Review')
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const Book = require('../models/Book')
const mongoose = require('mongoose')

// Get customer name from User collection
const getCustomerName = user => {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
}

// Check successful purchase
const isBookPurchased = async (email, bookId) => {
  if (typeof email !== 'string' || !email.trim()) return false

  const normalizedEmail = email.trim().toLowerCase()

  const transactions = await Transaction.find({
    email: normalizedEmail
  })
    .select('status products')
    .lean()

  return transactions.some(
    transaction =>
      transaction.status === 'Success' &&
      (transaction.products || []).some(
        product => String(product.bookId) === String(bookId)
      )
  )
}

// ADD / UPDATE REVIEW
exports.addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body
    const { bookId } = req.params
    const userId = req.user?._id || req.user?.id
    const email = req.user?.email

    if (!userId || !email) {
      return res.status(401).json({
        message: 'User authentication required'
      })
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: 'Invalid book ID'
      })
    }

    // Check whether book exists
    const book = await Book.findById(bookId).select('bookTittle')

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      })
    }

    const numericRating = Number(rating)

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5'
      })
    }

    if (
      typeof title !== 'string' ||
      typeof comment !== 'string' ||
      !title.trim() ||
      !comment.trim()
    ) {
      return res.status(400).json({
        message: 'Review title and comment are required'
      })
    }

    if (title.trim().length > 100 || comment.trim().length > 2000) {
      return res.status(400).json({
        message: 'Review text exceeds the allowed length'
      })
    }

    const user = await User.findById(userId).select('firstName lastName email')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const userName = getCustomerName(user)

    if (!userName) {
      return res.status(400).json({
        message: 'Customer name not found'
      })
    }

    // Check successful purchase
    const verified = await isBookPurchased(email, bookId)

    if (!verified) {
      return res.status(403).json({
        message:
          'You can review this book only after purchasing it successfully.'
      })
    }

    // Add or update existing review
    const review = await Review.findOneAndUpdate(
      { book: bookId, userId },
      {
        $set: {
          bookTitle: book.bookTittle || '',
          rating: numericRating,
          title: title.trim(),
          comment: comment.trim(),
          userName,
          isVerifiedPurchase: true,
          status: 'Active'
        },
        $setOnInsert: {
          book: bookId,
          userId
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    )

    return res.status(200).json({
      message: 'Review submitted successfully',
      review
    })
  } catch (error) {
    console.error('Add Review Error:', error.message)

    return res.status(500).json({
      message: 'Unable to submit review'
    })
  }
}

// GET ALL REVIEWS FOR A BOOK
exports.getReviews = async (req, res) => {
  try {
    const { bookId } = req.params

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: 'Invalid book ID'
      })
    }

    const reviews = await Review.find({
      book: bookId,
      status: 'Active'
    })
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      totalReviews: reviews.length,
      reviews
    })
  } catch (error) {
    console.error('Get Reviews Error:', error.message)

    return res.status(500).json({
      message: 'Unable to fetch reviews'
    })
  }
}

// GET RATING SUMMARY
exports.getRatingSummary = async (req, res) => {
  try {
    const { bookId } = req.params

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: 'Invalid book ID'
      })
    }

    const summary = await Review.aggregate([
      {
        $match: {
          book: new mongoose.Types.ObjectId(bookId),
          status: 'Active'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          fiveStars: {
            $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
          },
          fourStars: {
            $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] }
          },
          threeStars: {
            $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] }
          },
          twoStars: {
            $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] }
          },
          oneStar: {
            $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] }
          }
        }
      }
    ])

    const data = summary[0] || {
      averageRating: 0,
      totalReviews: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0
    }

    return res.status(200).json({
      averageRating: Number((data.averageRating || 0).toFixed(1)),
      totalReviews: data.totalReviews,
      ratingBreakdown: {
        5: data.fiveStars,
        4: data.fourStars,
        3: data.threeStars,
        2: data.twoStars,
        1: data.oneStar
      }
    })
  } catch (error) {
    console.error('Rating Summary Error:', error.message)

    return res.status(500).json({
      message: 'Unable to fetch rating summary'
    })
  }
}

// DELETE OWN REVIEW
exports.deleteReview = async (req, res) => {
  try {
    const { bookId } = req.params
    const userId = req.user?._id || req.user?.id

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication required'
      })
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: 'Invalid book ID'
      })
    }

    const review = await Review.findOneAndDelete({
      book: bookId,
      userId
    })

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      })
    }

    return res.status(200).json({
      message: 'Review deleted successfully'
    })
  } catch (error) {
    console.error('Delete Review Error:', error.message)

    return res.status(500).json({
      message: 'Unable to delete review'
    })
  }
}

// HELPFUL VOTE
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params
    const userId = req.user?._id || req.user?.id

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication required'
      })
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        message: 'Invalid review ID'
      })
    }

    const review = await Review.findById(reviewId)

    if (!review || review.status !== 'Active') {
      return res.status(404).json({
        message: 'Review not found'
      })
    }

    if (String(review.userId) === String(userId)) {
      return res.status(400).json({
        message: 'You cannot vote on your own review'
      })
    }

    const alreadyVoted = review.helpfulUsers.some(
      id => String(id) === String(userId)
    )

    let updatedReview

    if (alreadyVoted) {
      updatedReview = await Review.findOneAndUpdate(
        {
          _id: reviewId,
          helpfulUsers: userId
        },
        {
          $pull: { helpfulUsers: userId },
          $inc: { helpfulCount: -1 }
        },
        { new: true }
      )
    } else {
      updatedReview = await Review.findOneAndUpdate(
        {
          _id: reviewId,
          helpfulUsers: { $ne: userId }
        },
        {
          $addToSet: { helpfulUsers: userId },
          $inc: { helpfulCount: 1 }
        },
        { new: true }
      )
    }

    if (!updatedReview) {
      return res.status(409).json({
        message: 'Please try voting again'
      })
    }

    if (updatedReview.helpfulCount < 0) {
      updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { $set: { helpfulCount: 0 } },
        { new: true }
      )
    }

    return res.status(200).json({
      message: alreadyVoted ? 'Helpful vote removed' : 'Marked as helpful',
      helpfulCount: updatedReview.helpfulCount
    })
  } catch (error) {
    console.error('Helpful Vote Error:', error.message)

    return res.status(500).json({
      message: 'Unable to update helpful vote'
    })
  }
}

// UPDATE OLD REVIEWS WITH MISSING USER NAMES
exports.updateOldReviewNames = async (req, res) => {
  try {
    const reviews = await Review.find({
      $or: [
        { userName: { $exists: false } },
        { userName: null },
        { userName: '' }
      ]
    })

    let updatedCount = 0

    for (const review of reviews) {
      const user = await User.findById(review.userId).select(
        'firstName lastName'
      )

      if (!user) continue

      const userName = getCustomerName(user)

      if (!userName) continue

      await Review.updateOne({ _id: review._id }, { $set: { userName } })

      updatedCount++
    }

    return res.status(200).json({
      message: 'Old review names updated successfully',
      updatedCount
    })
  } catch (error) {
    console.error('Update Old Review Names Error:', error.message)

    return res.status(500).json({
      message: 'Unable to update old review names'
    })
  }
}

// ADMIN: UPDATE REVIEW STATUS
exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { status } = req.body

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        message: 'Invalid review ID'
      })
    }

    if (!['Active', 'Hidden'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be Active or Hidden'
      })
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $set: { status } },
      { new: true, runValidators: true }
    )

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      })
    }

    return res.status(200).json({
      message: `Review ${status} successfully`,
      review
    })
  } catch (error) {
    console.error('Update Review Status Error:', error.message)

    return res.status(500).json({
      message: 'Unable to update review status'
    })
  }
}

// ADMIN: GET ALL REVIEWS
exports.getAllReviews = async (req, res) => {
  try {
    const { status = 'All', search = '', page = 1, limit = 5 } = req.query

    const pageNumber = Math.max(1, parseInt(page, 10) || 1)
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10) || 5))

    const searchText =
      typeof search === 'string' ? search.trim().toLowerCase() : ''

    let reviews = await Review.find()
      .populate('book')
      .sort({ createdAt: -1 })
      .lean()

    // Filter by status
    if (['Active', 'Hidden'].includes(status)) {
      reviews = reviews.filter(review => review.status === status)
    }

    // Search reviews
    if (searchText) {
      reviews = reviews.filter(review => {
        const book = review.book || {}

        const searchableText = [
          review.userName,
          review.title,
          review.comment,
          book.bookTitle,
          book.bookTittle,
          book.title
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(searchText)
      })
    }

    const totalReviews = reviews.length
    const totalPages = Math.ceil(totalReviews / limitNumber)
    const startIndex = (pageNumber - 1) * limitNumber

    const paginatedReviews = reviews.slice(startIndex, startIndex + limitNumber)

    return res.status(200).json({
      success: true,
      totalReviews,
      totalPages,
      currentPage: pageNumber,
      reviews: paginatedReviews
    })
  } catch (error) {
    console.error('Get All Reviews Error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch reviews'
    })
  }
}
