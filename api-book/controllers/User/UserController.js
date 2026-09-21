const User = require('../../models/User')
const bcrypt = require('bcrypt')

const addUser = async (req, res) => {
  try {
    //console.log(req.body)
    let user = await User.findOne({ email: req.body.email, userType: 'user' })
    if (user) {
      res.status(400).send({ message: 'User Already Exist' })
    } else {
      let password = bcrypt.hashSync(req.body.password, 10);
      let user = new User(req.body);
      user.password = password;
      await user.save();  
      res.status(200).send({ success: true, message: "Welcome to Our platform, Pls login" })
    }
  } catch (err) {
    console.log(err)
    res.status(400).send({ success: false })
  }
}



module.exports = {
  addUser
}
