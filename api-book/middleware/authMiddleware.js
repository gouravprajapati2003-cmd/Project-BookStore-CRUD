const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required'
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded._id).select('-password')

    if (!user || user.status !== 'Active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive account'
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

const superAdminMiddleware = (req, res, next) => {
  if (
    !req.user ||
    req.user.userType !== 'admin' ||
    req.user.isSuperAdmin !== true
  ) {
    return res.status(403).json({
      success: false,
      message: 'Only Super Admin can perform this action'
    })
  }

  next()
}

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only Admin can access this resource'
    })
  }

  next()
}


module.exports = {
  authMiddleware,
  superAdminMiddleware,
  adminMiddleware,
}
