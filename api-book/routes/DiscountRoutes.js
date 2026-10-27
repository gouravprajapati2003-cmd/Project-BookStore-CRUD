const express = require('express')
const DiscountController = require('../controllers/DiscountController')
const router = express.Router()

router.get('/books/for/discount', (req, res) => {
  DiscountController.getBooks(req, res)
})

router.post('/add/discount', (req, res) => {
  DiscountController.addDiscount(req, res)
})
router.get('/discounts', (req, res) => {
  DiscountController.getDiscounts(req, res)
})
router.get('/discount/for/edit/:id', (req, res) => {
  DiscountController.getDiscountForEdit(req, res)
})
router.put('/edit/discount/:id', (req, res) => {
  DiscountController.editDiscount(req, res)
})
router.put('/discount/status/:id', (req, res) => {
  DiscountController.updateDiscountStatus(req, res)
})

module.exports = router
