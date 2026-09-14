const Book = require('../models/Book')
const cloudinary = require('cloudinary').v2
const addBook = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: 'doalyba9',
      api_key: '922532147938742',
      api_secret: 'cxzzFkdrUBxagsOZQyrMynM_BQo'
    })
    const upload = await cloudinary.uploader.upload(req.file.path)
    // console.log(upload)
    req.body.bookImage = upload.secure_url;
    let book = new Book(req.body)
    await book.save()
    // console.log('Data Saved Successfully...')
    res.status(200).send({ message: 'Data Has Been Add Successfully' })
  } catch (error) {
    res.status(400).send({ message: 'Something Went Wrong' })
  }
}
const getBooks = async (req, res) => {
  try {
    let totalBooks = await Book.countDocuments({})
    // console.log('Total Books = ',totalBooks);
    let books = await Book.find({
      bookTitle: new RegExp(req.query.searchBook, 'i')
    })
      .skip((req.query.pageNo - 1) * req.query.booksPerPage)
      .limit(req.query.booksPerPage)
    res.status(200).send({ data: books, totalBooks: totalBooks })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: error })
  }
}
const deleteBook = async (req, res) => {
  try {
    id = req.params.id
    await Book.deleteOne({ _id: id })
    res.status(200).send({ success: true })
  } catch (error) {
    console.log(error)
    res.status(400).send({ success: false })
  }
}
const getBookForEdit = async (req, res) => {
  try {
    let id = req.params.id
    //console.log(id);
    let book = await Book.findOne({ _id: id })
    // console.log(book);
    res.status(200).send({ data: book })
  } catch (error) {
    console.log(error)
    res.status(400).send({ data: err })
  }
}
const editBook = async (req, res) => {
  try {
    let id = req.params.id
    // console.log(id)
    let book = req.body
    // console.log(book)
    await Book.updateOne({ _id: id }, req.body)
    // console.log('Book Updated Successfully...')
    res.status(200).send({ success: true })
  } catch (error) {
    console.log(error)
    res.status(400).send({ success: false })
  }
}

module.exports = {
  addBook,
  getBooks,
  deleteBook,
  getBookForEdit,
  editBook
}
