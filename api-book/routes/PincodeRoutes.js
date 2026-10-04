const express = require('express')

const router = express.Router()

const PincodeController = require('../controllers/PincodeController')

router.get('/books/pincode', (req, res) => {
    DiscountController.getBooks(req, res);
})

router.post('/add/pincode', (req, res) => {
    PincodeController.addBookAtPlace(req, res)
})

router.post('/check/book/pincode', (req, res) => {
    PincodeController.checkBookPincode(req, res)
})

router.get('/pincodes', (req, res) => {
    PincodeController.getPincodes(req, res)
})

router.get('/pincode/:id', (req, res) => {
  PincodeController.getPincodeById(req, res)
})

router.put('/edit/pincode/:id', (req, res) => {
  PincodeController.editPincode(req, res)
})


module.exports = router;
