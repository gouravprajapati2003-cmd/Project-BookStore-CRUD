const express = require('express')
const router = express.Router();
const UserController = require('../../controllers/User/UserController')

router.post('/create/user', (req, res) => {
        UserController.addUser(req, res);
})

module.exports = router;