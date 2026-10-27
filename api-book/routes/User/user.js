const express = require('express')
const router = express.Router();
const UserController = require('../../controllers/User/UserController')

router.post('/create/user', (req, res) => {
        UserController.addUser(req, res);
})
router.post('/user/login', (req, res) => {
        UserController.doUserLogin(req, res);
})
router.put('/update/status/:id', (req, res) => {
        UserController.updateUserStatus(req, res)
})

module.exports = router;