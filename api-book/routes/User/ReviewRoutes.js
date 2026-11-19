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

// Public Routes
router.get('/user/book/:bookId/reviews', getReviews)
router.get('/user/book/:bookId/rating', getRatingSummary)

// Protected Routes
router.post('/user/book/:bookId/review', authMiddleware, addReview)

router.delete('/user/book/:bookId/review', authMiddleware, deleteReview)

router.post('/user/review/:reviewId/helpful', authMiddleware, markHelpful)

// Temporary migration route
router.post(
  '/admin/reviews/update-user-names',
  authMiddleware,
  async (req, res, next) => {
    if (req.user?.userType !== 'admin' && !req.user?.isSuperAdmin) {
      return res.status(403).json({
        message: 'Admin access required'
      })
    }
    next()
  },
  updateOldReviewNames
)

// Admin: Hide / Active Review
router.patch(
  '/admin/reviews/:reviewId/status',
  authMiddleware,
  async (req, res, next) => {
  console.log('Logged in User:', {
    id: req.user?._id,
    email: req.user?.email,
    userType: req.user?.userType,
    isSuperAdmin: req.user?.isSuperAdmin
  })

  if (req.user?.userType !== 'admin' && req.user?.isSuperAdmin !== true) {
    return res.status(403).json({
      message: 'Admin access required'
    })
  }

  next()
},

  updateReviewStatus
)

// Admin: Get All Reviews
router.get(
  '/admin/reviews',
  authMiddleware,
  async (req, res, next) => {
    if (req.user?.userType !== 'admin' && req.user?.isSuperAdmin !== true) {
      return res.status(403).json({
        message: 'Admin access required'
      })
    }

    next()
  },
  getAllReviews
)


module.exports = router;