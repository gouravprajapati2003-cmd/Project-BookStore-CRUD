const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const doAdminLogin = async (req, res) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase()

    const password = String(req.body.password || '')

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      })
    }

    const user = await User.findOne({
      email,
      userType: 'admin'
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive.'
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.'
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        userType: user.userType
      },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    )

    user.lastLogin = new Date()
    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      data: {
        _id: user._id,
        email: user.email,
        name: user.firstName,
        userType: user.userType,
        isSuperAdmin: user.isSuperAdmin,
        token
      }
    })
  } catch (err) {
    console.error('Admin Login Error:', err)

    return res.status(500).json({
      success: false,
      message: 'Something went wrong.'
    })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')

    return res.status(200).json({
      success: true,
      data: users
    })
  } catch (err) {
    console.error('Get Users Error:', err.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch users.'
    })
  }
}

const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNo } = req.body

    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, email and password are required.'
      })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.'
      })
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = await User.create({
      firstName: firstName.trim(),
      lastName: lastName || '',
      mobileNo: mobileNo || '',
      email: normalizedEmail,
      password: hashedPassword,
      userType: 'admin',
      isSuperAdmin: false,
      status: 'Active'
    })

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully.',
      data: {
        _id: newAdmin._id,
        firstName: newAdmin.firstName,
        email: newAdmin.email,
        userType: newAdmin.userType
      }
    })
  } catch (err) {
    console.error('Create Admin Error:', err)

    return res.status(500).json({
      success: false,
      message: 'Something went wrong.'
    })
  }
}

const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      userType: 'admin'
    })
      .select('-password')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      data: admins
    })
  } catch (err) {
    console.error('Get Admins Error:', err.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch admins.'
    })
  }
}

const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.'
      })
    }

    const admin = await User.findById(id)

    if (!admin || admin.userType !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.'
      })
    }

    // Super Admin ka status change nahi hoga
    if (admin.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Super Admin status cannot be changed.'
      })
    }

    admin.status = status
    await admin.save()

    return res.status(200).json({
      success: true,
      message: `Admin status changed to ${status}.`,
      data: {
        _id: admin._id,
        status: admin.status
      }
    })
  } catch (err) {
    console.error('Update Admin Status Error:', err.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to update admin status.'
    })
  }
}

module.exports = {
  doAdminLogin,
  getUsers,
  createAdmin,
  getAdmins,
  updateAdminStatus
}
