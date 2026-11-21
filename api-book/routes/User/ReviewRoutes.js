const express = require('express')
const router = express.Router()

const {
  addReview,
  getReviews,
  getRatingSummary,
  deleteReview,
  markHelpful,
  updateOldReviewNames,
  updateReviewStatus,
  getAllReviews
} = require('../../controllers/ReviewController')

const { authMiddleware } = require('../../middleware/authMiddleware')

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user?.userType !== 'admin' && req.user?.isSuperAdmin !== true) {
    return res.status(403).json({
      message: 'Admin access required'
    })
  }

  next()
}

// Public Routes
router.get('/user/book/:bookId/reviews', getReviews)
router.get('/user/book/:bookId/rating', getRatingSummary)

// Protected User Routes
router.post('/user/book/:bookId/review', authMiddleware, addReview)

router.delete('/user/book/:bookId/review', authMiddleware, deleteReview)

router.post('/user/review/:reviewId/helpful', authMiddleware, markHelpful)

// Admin: Update Old Review User Names
router.post(
  '/admin/reviews/update-user-names',
  authMiddleware,
  adminMiddleware,
  updateOldReviewNames
)

// Admin: Update Review Status
router.patch(
  '/admin/reviews/:reviewId/status',
  authMiddleware,
  adminMiddleware,
  updateReviewStatus
)

// Admin: Get All Reviews
router.get('/admin/reviews', authMiddleware, adminMiddleware, getAllReviews)

module.exports = router
