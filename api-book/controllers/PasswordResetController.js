const User = require('../models/User')
const PasswordReset = require('../models/PasswordReset')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const hashValue = value => {
  return crypto.createHash('sha256').update(value).digest('hex')
}

// Server-side route se account type milega.
const getAllowedUserType = req => {
  return req.passwordResetUserType
}

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  })

  await transporter.sendMail({
    from: `"G.K.P. Book Store" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP - G.K.P. Book Store',
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;color:#333">
        <h2 style="color:#142D4E">G.K.P. Book Store</h2>
        <p>You requested to reset your password.</p>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:8px;color:#142D4E">${otp}</h1>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
        <p>Do not share this OTP with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `
  })
}

// STEP 1: Send OTP
const sendForgotPasswordOtp = async (req, res) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase()

    const userType = getAllowedUserType(req)

    if (!email || !['user', 'admin'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required.'
      })
    }

    const user = await User.findOne({
      email,
      userType,
      status: 'Active'
    })

    const genericMessage =
      'If an active account exists with this email, an OTP will be sent.'

    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMessage
      })
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail SMTP credentials are missing.')

      return res.status(500).json({
        success: false,
        message: 'Email service is not configured.'
      })
    }

    const existingReset = await PasswordReset.findOne({ email })

    if (
      existingReset?.resendAvailableAt &&
      existingReset.resendAvailableAt > new Date()
    ) {
      return res.status(200).json({
        success: true,
        message: genericMessage
      })
    }

    const otp = crypto.randomInt(100000, 1000000).toString()
    const otpHash = hashValue(otp)
    const now = new Date()

    await PasswordReset.findOneAndUpdate(
      { email },
      {
        $set: {
          userId: user._id,
          email,
          userType,
          isSuperAdmin: Boolean(user.isSuperAdmin),
          otpHash,
          otpExpiresAt: new Date(now.getTime() + 5 * 60 * 1000),
          attempts: 0,
          resendAvailableAt: new Date(now.getTime() + 60 * 1000),
          resetTokenHash: null,
          resetTokenExpiresAt: null
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    )

    try {
      await sendOtpEmail(email, otp)
    } catch (mailError) {
      await PasswordReset.deleteOne({
        email,
        otpHash
      })

      console.error('OTP Email Error:', mailError)

      return res.status(500).json({
        success: false,
        message: 'Unable to send OTP. Please try again later.'
      })
    }

    return res.status(200).json({
      success: true,
      message: genericMessage
    })
  } catch (err) {
    console.error('Send OTP Error:', err)

    return res.status(500).json({
      success: false,
      message: 'Something went wrong.'
    })
  }
}

// STEP 2: Verify OTP
const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase()

    const otp = String(req.body.otp || '').trim()
    const userType = getAllowedUserType(req)

    if (
      !email ||
      !/^\d{6}$/.test(otp) ||
      !['user', 'admin'].includes(userType)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid email and 6-digit OTP are required.'
      })
    }

    const resetRecord = await PasswordReset.findOne({
      email,
      userType
    })

    if (!resetRecord || !resetRecord.otpHash) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP.'
      })
    }

    if (!resetRecord.otpExpiresAt || resetRecord.otpExpiresAt <= new Date()) {
      await PasswordReset.deleteOne({ _id: resetRecord._id })

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      })
    }

    if (resetRecord.attempts >= 5) {
      await PasswordReset.deleteOne({ _id: resetRecord._id })

      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.'
      })
    }

    const submittedHash = hashValue(otp)

    const isValid = crypto.timingSafeEqual(
      Buffer.from(submittedHash, 'hex'),
      Buffer.from(resetRecord.otpHash, 'hex')
    )

    if (!isValid) {
      resetRecord.attempts += 1
      await resetRecord.save()

      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. ${
          5 - resetRecord.attempts
        } attempts remaining.`
      })
    }

    const user = await User.findOne({
      _id: resetRecord.userId,
      email,
      userType,
      status: 'Active',
      isSuperAdmin: Boolean(resetRecord.isSuperAdmin)
    })

    if (!user) {
      await PasswordReset.deleteOne({ _id: resetRecord._id })

      return res.status(400).json({
        success: false,
        message: 'Unable to verify this account.'
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')

    resetRecord.otpHash = null
    resetRecord.otpExpiresAt = null
    resetRecord.resetTokenHash = hashValue(resetToken)
    resetRecord.resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await resetRecord.save()

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      data: {
        resetToken
      }
    })
  } catch (err) {
    console.error('Verify OTP Error:', err)

    return res.status(500).json({
      success: false,
      message: 'Something went wrong.'
    })
  }
}

// STEP 3: Reset Password
const resetPassword = async (req, res) => {
  try {
    const resetToken = String(req.body.resetToken || '')
    const newPassword = String(req.body.newPassword || '')
    const userType = getAllowedUserType(req)

    if (!resetToken || !newPassword || !['user', 'admin'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required.'
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.'
      })
    }

    const resetTokenHash = hashValue(resetToken)

    const resetRecord = await PasswordReset.findOne({
      resetTokenHash,
      userType,
      resetTokenExpiresAt: { $gt: new Date() }
    })

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset session. Please verify OTP again.'
      })
    }

    const user = await User.findOne({
      _id: resetRecord.userId,
      email: resetRecord.email,
      userType,
      status: 'Active',
      isSuperAdmin: Boolean(resetRecord.isSuperAdmin)
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Unable to reset password for this account.'
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Consume the reset token only once.
    const consumedRecord = await PasswordReset.findOneAndDelete({
      _id: resetRecord._id,
      resetTokenHash,
      userType,
      resetTokenExpiresAt: { $gt: new Date() }
    })

    if (!consumedRecord) {
      return res.status(400).json({
        success: false,
        message: 'Reset session already used or expired.'
      })
    }

    user.password = hashedPassword
    await user.save()

    return res.status(200).json({
      success: true,
      message:
        'Password reset successfully. Please login with your new password.'
    })
  } catch (err) {
    console.error('Reset Password Error:', err)

    return res.status(500).json({
      success: false,
      message: 'Something went wrong.'
    })
  }
}

module.exports = {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword
}
