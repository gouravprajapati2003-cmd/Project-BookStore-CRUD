const express = require('express')
const router = express.Router();
const UserController = require('../../controllers/User/UserController')
const PasswordResetController = require('../../controllers/PasswordResetController')

router.post('/create/user', (req, res) => {
        UserController.addUser(req, res);
})
router.post('/user/login', (req, res) => {
        UserController.doUserLogin(req, res);
})
router.put('/update/status/:id', (req, res) => {
        UserController.updateUserStatus(req, res)
})

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

module.exports = router;