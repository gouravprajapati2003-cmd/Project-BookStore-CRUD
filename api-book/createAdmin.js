const User = require('./models/User')
const bcrypt = require('bcrypt')

const createAdmin = async () => {
  try {
    let user = await User.findOne({
      email: 'admin@yopmail.com'
    })

    if (user) {
      user.isSuperAdmin = true
      user.userType = 'admin'
      await user.save()

      console.log('Super Admin updated successfully')
    } else {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_INITIAL_PASSWORD,
        10
      )

      user = new User({
        firstName: 'Gourav',
        lastName: 'Kumar',
        mobileNo: '8171818132',
        email: 'admin@yopmail.com',
        password: hashedPassword,
        userType: 'admin',
        isSuperAdmin: true,
        status: 'Active'
      })

      await user.save()

      console.log('Super Admin created successfully')
    }
  } catch (err) {
    console.error('Create Super Admin Error:', err)
  }
}

module.exports = createAdmin
