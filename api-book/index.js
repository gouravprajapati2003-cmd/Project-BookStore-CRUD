require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connect = require('./connection')
const createAdmin = require('./createAdmin')

const book = require('./routes/BookRoutes')
const User = require('./routes/UserRoutes')
const home = require('./routes/User/home')
const discount = require('./routes/DiscountRoutes')
const frontUser = require('./routes/User/user')
const pincode = require('./routes/PincodeRoutes')
const payment = require('./routes/User/Payment')
const transaction = require('./routes/PaymentRoutes')
const review = require('./routes/User/ReviewRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use(book)
app.use(discount)
app.use(home)
app.use(frontUser)
app.use(User)
app.use(pincode)
app.use(payment)
app.use(transaction)
app.use(review)

const startServer = async () => {
  try {
    await connect()
    await createAdmin()

    app.listen(3000, () => {
      console.log('Server is Running on 3000')
    })
  } catch (error) {
    console.log('Server Startup Error:', error.message)
  }
}

startServer()
