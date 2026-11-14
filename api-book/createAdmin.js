const User = require('./models/User')
const bcrypt = require('bcrypt')

const createAdmin = async () => {
  try {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase()
    const initialPassword = process.env.SUPER_ADMIN_PASSWORD
    const superAdminMobNo = process.env.SUPER_ADMIN_MOBILENO

    if (!adminEmail) {
      throw new Error('SUPER_ADMIN_EMAIL is missing in .env')
    }

    let user = await User.findOne({
      email: adminEmail
    })

    if (user) {
      user.isSuperAdmin = true
      user.userType = 'admin'
      user.status = 'Active'

      if (superAdminMobNo) {
        user.mobileNo = superAdminMobNo
      }

      await user.save()

      console.log('Super Admin verified successfully')
    } else {
      if (!initialPassword) {
        throw new Error('SUPER_ADMIN_PASSWORD is missing in .env')
      }

      const hashedPassword = await bcrypt.hash(initialPassword, 10)

      user = new User({
        firstName: 'Gourav',
        lastName: 'Kumar',
        mobileNo: superAdminMobNo,
        email: adminEmail,
        password: hashedPassword,
        userType: 'admin',
        isSuperAdmin: true,
        status: 'Active'
      })

      await user.save()

      console.log('Super Admin created successfully')
    }
  } catch (err) {
    console.error('Create Super Admin Error:', err.message)
  }
}

module.exports = createAdmin
