const Razorpay = require('razorpay')
const Transaction = require('../../models/Transaction')
const crypto = require('crypto')

const makePayment = async (req, res) => {
  try {
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})
    //console.log(req.body)
    let transaction = new Transaction(req.body)
    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: req.body.firstName
    }
    const order = await razorpay.orders.create(options)
   // console.log(order)
    transaction.transactionId = order.id
    res.status(200).json(order)
    await transaction.save()
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) // '' me secret key likho
      .update(sign.toString())
      .digest('hex')
   // console.log(expectedSign, 'expectedSign')
    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: 'Payment verified successfully' })
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid signature, payment failed!' })
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  makePayment,
  verifyPayment
}
