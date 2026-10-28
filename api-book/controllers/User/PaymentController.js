const Razorpay = require('razorpay')
const Transaction = require('../../models/Transaction')
const crypto = require('crypto')

// Create Razorpay order and save transaction
const makePayment = async (req, res) => {
  try {
    const {
      amount,
      firstName,
      lastName,
      email,
      mobileNo,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      products
    } = req.body

    if (!email || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: 'Valid email and amount are required'
      })
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    })

    const transaction = new Transaction({
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      mobileNo,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      amount: Number(amount),
      products: Array.isArray(products) ? products : [],
      transactionId: order.id,
      status: 'Pending'
    })

    // Database save must finish before sending the response
    await transaction.save()

    return res.status(200).json(order)
  } catch (err) {
    console.error('makePayment error:', err)
    return res.status(500).json({
      message: 'Unable to create payment order'
    })
  }
}

// Verify Razorpay payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: 'Payment verification details are missing'
      })
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`

    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex')

    const received = Buffer.from(razorpay_signature, 'utf8')
    const expected = Buffer.from(expectedSign, 'utf8')

    const isValid =
      received.length === expected.length &&
      crypto.timingSafeEqual(received, expected)

    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid payment signature'
      })
    }

    const transaction = await Transaction.findOne({
      transactionId: razorpay_order_id
    })

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found'
      })
    }

    transaction.status = 'Success'
    await transaction.save()

    return res.status(200).json({
      message: 'Payment verified successfully',
      data: razorpay_order_id
    })
  } catch (err) {
    console.error('verifyPayment error:', err)
    return res.status(500).json({
      message: 'Payment verification failed'
    })
  }
}

// Fetch logged-in user's orders by email
const getMyOrders = async (req, res) => {
  try {
    const email = req.body.email

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      })
    }

    const myOrders = await Transaction.find({
      email: {
        $regex: `^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        $options: 'i'
      }
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      data: myOrders
    })
  } catch (err) {
    console.error('getMyOrders error:', err)
    return res.status(500).json({
      message: 'Unable to fetch orders'
    })
  }
}

module.exports = {
  makePayment,
  verifyPayment,
  getMyOrders
}
