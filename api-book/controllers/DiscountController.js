const Book = require('../models/Book')
const Discount = require('../models/Discount')

const getBooks = async (req, res) => {
  try {
    let books = await Book.find({}, { _id: 1, bookTittle: 1 })
    // console.log(books, 'books')
    res.status(200).send({ data: books })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: 'Something Went Wrong' })
  }
}

const addDiscount = async (req, res) => {
  try {
    // console.log(req.body);
    let discount = new Discount(req.body)
    await discount.save()
    res.status(200).send({ message: 'Discount Added' })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: 'Something Went Wrong...' })
  }
}

const getDiscounts = async (req, res) => {
  try {
    let discounts = await Discount.find({}).populate('book')
    // console.log(discounts);
    res.status(200).send({ data: discounts })
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'Something Went Wrong' })
  }
}

const getDiscountForEdit = async (req, res) => {
  try {
    let id = req.params.id
    let discount = await Discount.findOne({ _id: id })
    let books = await Book.find({})
    //console.log(discount);
    res.status(200).send({ data: discount, books: books })
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'Something went Wrong' })
  }
}

const editDiscount = async (req, res) => {
  try {
    let id = req.params.id
    await Discount.updateOne({ _id: id }, req.body)
    // console.log("Data Has Been Updated Successfully")
    res.status(200).send({ message: 'Data Inserted Successfully' })
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'Data Inserted Failed...' })
  }
}

const updateDiscountStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid status'
      })
    }

    const discount = await Discount.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!discount) {
      return res.status(404).send({
        success: false,
        message: 'Discount not found'
      })
    }

    res.status(200).send({
      success: true,
      message: 'Discount status updated successfully',
      data: discount
    })
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message
    })
  }
}

module.exports = {
  getBooks,
  addDiscount,
  getDiscounts,
  getDiscountForEdit,
  editDiscount,
  updateDiscountStatus
}
