const Book = require('../models/Book')
const Discount = require('../models/Discount')

const getBooks = async (req, res) => {
  try {
    let books = await Book.find({}, { _id: 1, bookTitle: 1 })
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
    await discount.save();
    res.status(200).send({ message: 'Discount Added' })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: 'Something Went Wrong...' })
  }
}

const getDiscounts = async (req, res) => {
  try {
    let discounts = await Discount.find({}).populate('book');
   // console.log(discounts);
    res.status(200).send({ data: discounts});  
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'Something Went Wrong' })
  }
}

const getDiscountForEdit = async (req, res) => {
  try {
   let id = req.params.id;
   let discount = await Discount.findOne({_id: id}).populate('book');
   console.log(discount);
   res.status(200).send({data: discount});
  } catch (err) {
    console.log(err);
    res.status(400).send({message: 'Something went Wrong'})
  }
}

module.exports = {
  getBooks,
  addDiscount,
  getDiscounts,
  getDiscountForEdit,
}
