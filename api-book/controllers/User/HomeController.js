const Book = require('../../models/Book')
const Discount = require('../../models/Discount')

const getBooks = async (req, res) => {
  try {
    //let books = await Book.find({})
    let books = await Book.aggregate([
      {
        $lookup: {
          from: 'discounts',
          localField: '_id',
          foreignField: 'book',
          as: 'DiscountDetail'
        }
      }
    ])
    //console.log('Books For User = ', books);

    res.status(200).send({ data: books })
  } catch (err) {
    console.log(err)
    res.status(200).send({ message: 'Something Went Wrong' })
  }
}

const getBookForUser = async (req, res) => {
  try {
    let id = req.params.id
    let book = await Book.findOne({ _id: id }).lean()
    //console.log(book)
    let discount = await Discount.findOne({ book: book._id }).lean()
    book = { ...book, ...discount }
    //console.log(book)
    res.status(200).send({ data: book })
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'Somethin Went Wrong' })
  }
}

module.exports = {
  getBooks,
  getBookForUser
}
