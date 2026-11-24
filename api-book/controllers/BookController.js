const Book = require('../models/Book')
const cloudinary = require('cloudinary').v2

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// ADD BOOK
const addBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: 'Book image is required'
      })
    }

    const upload = await cloudinary.uploader.upload(req.file.path)

    req.body.bookImage = upload.secure_url

    const book = new Book(req.body)

    await book.save()

    res.status(200).send({
      success: true,
      message: 'Data Has Been Add Successfully'
    })
  } catch (error) {
    console.log('ADD BOOK ERROR:', error)

    res.status(400).send({
      success: false,
      message: error.message
    })
  }
}

// GET ALL BOOKS
const getBooks = async (req, res) => {
  try {
    const pageNo = Number(req.query.pageNo) || 1
    const booksPerPage = Number(req.query.booksPerPage) || 5

    const searchBook = req.query.searchBook || ''

    const filter = {
      bookTittle: new RegExp(searchBook, 'i')
    }

    const totalBooks = await Book.countDocuments(filter)

    const books = await Book.find(filter)
      .skip((pageNo - 1) * booksPerPage)
      .limit(booksPerPage)

    res.status(200).send({
      data: books,
      totalBooks: totalBooks
    })
  } catch (error) {
    console.log('GET BOOKS ERROR:', error)

    res.status(400).send({
      message: error.message
    })
  }
}

// DELETE BOOK
const deleteBook = async (req, res) => {
  try {
    const id = req.params.id

    const book = await Book.findByIdAndDelete(id)

    if (!book) {
      return res.status(404).send({
        success: false,
        message: 'Book not found'
      })
    }

    res.status(200).send({
      success: true,
      message: 'Book deleted successfully'
    })
  } catch (error) {
    console.log('DELETE BOOK ERROR:', error)

    res.status(400).send({
      success: false,
      message: error.message
    })
  }
}

// GET BOOK FOR EDIT
const getBookForEdit = async (req, res) => {
  try {
    const id = req.params.id

    const book = await Book.findById(id)

    if (!book) {
      return res.status(404).send({
        success: false,
        message: 'Book not found'
      })
    }

    res.status(200).send({
      data: book
    })
  } catch (error) {
    console.log('GET BOOK FOR EDIT ERROR:', error)

    res.status(400).send({
      message: error.message
    })
  }
}

// EDIT BOOK
const editBook = async (req, res) => {
  try {
    const id = req.params.id

    // Find existing book
    const existingBook = await Book.findById(id)

    if (!existingBook) {
      return res.status(404).send({
        success: false,
        message: 'Book not found'
      })
    }

    // Get updated book details
    const updatedData = { ...req.body }

    // Upload new image only when selected
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path)

      updatedData.bookImage = upload.secure_url
    }

    // Update book in MongoDB
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updatedData },
      {
        new: true,
        runValidators: true
      }
    )

    res.status(200).send({
      success: true,
      message: 'Book Updated Successfully',
      data: updatedBook
    })
  } catch (error) {
    console.log('EDIT BOOK ERROR:', error)

    res.status(400).send({
      success: false,
      message: error.message
    })
  }
}

// GET BOOK BY ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).send({
        message: 'Book not found'
      })
    }

    res.status(200).send({
      data: book
    })
  } catch (error) {
    console.log('GET BOOK BY ID ERROR:', error)

    res.status(400).send({
      message: error.message
    })
  }
}

// EXPORT CONTROLLERS
module.exports = {
  addBook,
  getBooks,
  deleteBook,
  getBookForEdit,
  editBook,
  getBookById
}
