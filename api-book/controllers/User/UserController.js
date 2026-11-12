const User = require('../../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const addUser = async (req, res) => {
  try {
    const { firstName, lastName, mobileNo, email, password } = req.body

    if (!firstName || !email || !password) {
      return res.status(400).send({
        success: false,
        message: 'First name, email and password are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const normalizedEmail = req.body.email.trim().toLowerCase()

    const existingUser = await User.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: 'This email is already registered.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName?.trim() || '',
      mobileNo: mobileNo || '',
      email: normalizedEmail,
      password: hashedPassword,
      userType: 'user'
    })

    await user.save()

    return res.status(201).send({
      success: true,
      message: 'Registration successful. Please login.'
    })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).send({
        success: false,
        message: 'This email is already registered.'
      })
    }

    console.log(err)

    return res.status(500).send({
      success: false,
      message: 'Something went wrong'
    })
  }
}

const doUserLogin = async (req, res) => {
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
      userType: 'user'
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
        message: 'Your account is inactive. Please contact support.'
      })
    }

    const validUser = await bcrypt.compare(password, user.password)

    if (!validUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing')
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
      message: 'Login successful.',
      data: {
        email: user.email,
        name: user.firstName,
        token
      }
    })
  } catch (err) {
    console.error('Login Controller Error:', err)

    return res.status(500).json({
      success: false,
      message: 'Something went wrong during login.'
    })
  }
}


const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validate status
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid status'
      })
    }

    // Update user status
    const user = await User.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).send({
      success: true,
      message: 'User status updated successfully',
      data: user
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      message: 'Something went wrong'
    })
  }
}

module.exports = {
  addUser,
  doUserLogin,
  updateUserStatus
}
