const Transaction = require('../models/Transaction')

const getTransactions = async (req, res) => {
  try {
    let transactions = await Transaction.find({})
    console.log(transactions)
    res.status(200).send({ data: transactions })
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'Something Went Wrong' })
  }
}
module.exports = {
  getTransactions
}
