const express = require('express')
const PaymentController = require('../controllers/PaymentController')
const router = express.Router()

router.get('/transactions', (req, res) => {
  PaymentController.getTransactions(req, res)
})

module.exports = router
