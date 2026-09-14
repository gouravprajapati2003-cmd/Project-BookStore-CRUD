const User = require('../models/User')
const bcrypt = require('bcrypt')

const doAdminLogin = async (req, res) => {
  try {
    let email = req.body.email
    let user = await User.findOne({ email: email })
    if (!user) {
      res.status(400).send({ message: 'invalid user/password' })
    } else {
      let validPassword = await bcrypt.compare(req.body.password, user.password)
      if (validPassword) {
        user.lastLogin = new Date()
        await user.save()
        res.status(200).send({ success: true, data: user })
      } else {
        res.status(400).send({ message: 'invalid user/password' })
      }
    }
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: err })
  }
}

module.exports = {
  doAdminLogin
}
