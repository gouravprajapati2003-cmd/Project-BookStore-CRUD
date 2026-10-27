const express = require('express')
const PaymentController = require('../../controllers/user/PaymentController')
const router = express.Router()

router.post('/create-order', (req, res) => {
  PaymentController.makePayment(req, res)
})
router.post('/verify-payment', (req, res) => {
  PaymentController.verifyPayment(req, res)
})
router.post('/my/orders', (req, res) => {
  PaymentController.getMyOrders(req, res)
})

module.exports = router
