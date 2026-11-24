const express = require('express')
const router = express.Router()
const UserController = require('../../controllers/User/UserController')
const PasswordResetController = require('../../controllers/PasswordResetController')
const {
  authMiddleware,
  adminMiddleware
} = require('../../middleware/authMiddleware')
const uploadProfilePhoto = require('../../middleware/uploadProfilePhoto')

router.post('/create/user', (req, res) => {
  UserController.addUser(req, res)
})
router.post('/user/login', (req, res) => {
  UserController.doUserLogin(req, res)
})
// Update user status - Admin only
router.put(
  '/update/status/:id',
  authMiddleware,
  adminMiddleware,
  UserController.updateUserStatus
)
router.post('/user/password/forgot', (req, res) => {
  req.passwordResetUserType = 'user'
  PasswordResetController.sendForgotPasswordOtp(req, res)
})

router.post('/user/password/verify-otp', (req, res) => {
  req.passwordResetUserType = 'user'
  PasswordResetController.verifyForgotPasswordOtp(req, res)
})

router.post('/user/password/reset', (req, res) => {
  req.passwordResetUserType = 'user'
  PasswordResetController.resetPassword(req, res)
})

// Get profile
router.get('/user/profile', authMiddleware, UserController.getUserProfile)

// Update profile
router.put('/user/profile', authMiddleware, UserController.updateUserProfile)

// Upload/change profile photo
router.post(
  '/user/profile/photo',
  authMiddleware,
  (req, res, next) => {
    uploadProfilePhoto.single('profilePhoto')(req, res, error => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        })
      }

      next()
    })
  },
  UserController.uploadUserProfilePhoto
)

// Remove profile photo
router.delete(
  '/user/profile/photo',
  authMiddleware,
  UserController.removeUserProfilePhoto
)

module.exports = router
