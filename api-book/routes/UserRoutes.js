const express = require('express')
const UserController = require('../controllers/UserController')
const PasswordResetController = require('../controllers/PasswordResetController')

const {
  authMiddleware,
  superAdminMiddleware,
  adminMiddleware
} = require('../middleware/authMiddleware')

const route = express.Router()

route.post('/admin/login', (req, res) => {
  UserController.doAdminLogin(req, res)
})

route.get('/users', authMiddleware, adminMiddleware, (req, res) => {
  UserController.getUsers(req, res)
})

route.post(
  '/admin/create',
  authMiddleware,
  superAdminMiddleware,
  (req, res) => {
    UserController.createAdmin(req, res)
  }
)

route.get('/admins', authMiddleware, superAdminMiddleware, (req, res) => {
  UserController.getAdmins(req, res)
})

route.patch(
  '/admin/status/:id',
  authMiddleware,
  superAdminMiddleware,
  (req, res) => UserController.updateAdminStatus(req, res)
)

route.post('/admin/password/forgot', (req, res) => {
  req.passwordResetUserType = 'admin'
  PasswordResetController.sendForgotPasswordOtp(req, res)
})

route.post('/admin/password/verify-otp', (req, res) => {
  req.passwordResetUserType = 'admin'
  PasswordResetController.verifyForgotPasswordOtp(req, res)
})

route.post('/admin/password/reset', (req, res) => {
  req.passwordResetUserType = 'admin'
  PasswordResetController.resetPassword(req, res)
})

module.exports = route
