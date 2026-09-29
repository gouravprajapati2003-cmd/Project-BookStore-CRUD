const express = require('express');
const router = express.Router();
const HomeController = require('../../controllers/User/HomeController')

router.get('/user/books', (req, res) => {
    HomeController.getBooks(req, res);
})
router.get('/user/book/:id', (req, res) => {
    HomeController.getBookForUser(req, res);
})

module.exports = router;