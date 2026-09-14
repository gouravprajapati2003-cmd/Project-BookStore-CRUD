const express = require('express')
const UserController = require('../controllers/UserController')
const route = express.Router()

route.post('/admin/login', (req, res) => {
  UserController.doAdminLogin(req, res)
})

module.exports = route
