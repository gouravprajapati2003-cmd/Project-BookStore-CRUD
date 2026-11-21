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
    const id = req.params.id

    const book = await Book.findById(id).lean()

    if (!book) {
      return res.status(404).send({
        message: 'Book not found'
      })
    }

    const discount = await Discount.findOne({ book: book._id }).lean()

    const bookData = {
      ...book,
      DiscountDetail: discount ? [discount] : []
    }

    return res.status(200).send({
      data: bookData
    })
  } catch (err) {
    console.log('GET BOOK FOR USER ERROR:', err)

    return res.status(400).send({
      message: 'Something Went Wrong'
    })
  }
}


module.exports = {
  getBooks,
  getBookForUser
}
