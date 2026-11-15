// const Book = require('../models/Book')
// const cloudinary = require('cloudinary').v2
// const addBook = async (req, res) => {
//   try {
//     cloudinary.config({
//       cloud_name: 'doalyba9',
//       api_key: '922532147938742',
//       api_secret: 'cxzzFkdrUBxagsOZQyrMynM_BQo'
//     })
//     const upload = await cloudinary.uploader.upload(req.file.path)
//     // console.log(upload)
//     req.body.bookImage = upload.secure_url;
//     let book = new Book(req.body)
//     await book.save()
//     // console.log('Data Saved Successfully...')
//     res.status(200).send({ message: 'Data Has Been Add Successfully' })
//   } catch (error) {
//     res.status(400).send({ message: 'Something Went Wrong' })
//   }
// }

// const getBooks = async (req, res) => {
//   try {
//     let totalBooks = await Book.countDocuments({})
//     // console.log('Total Books = ',totalBooks);
//     let books = await Book.find({
//       bookTittle: new RegExp(req.query.searchBook || '', 'i')
//     })
//       .skip((req.query.pageNo - 1) * req.query.booksPerPage)
//       .limit(req.query.booksPerPage)
//     res.status(200).send({ data: books, totalBooks: totalBooks })
//   } catch (error) {
//     console.log(error)
//     res.status(400).send({ message: error })
//   }
// }

// const deleteBook = async (req, res) => {
//   try {
//     id = req.params.id
//     await Book.deleteOne({ _id: id })
//     res.status(200).send({ success: true })
//   } catch (error) {
//     console.log(error)
//     res.status(400).send({ success: false })
//   }
// }
// const getBookForEdit = async (req, res) => {
//   try {
//     let id = req.params.id
//     //console.log(id);
//     let book = await Book.findOne({ _id: id })
//     // console.log(book);
//     res.status(200).send({ data: book })
//   } catch (error) {
//     console.log(error)
//     res.status(400).send({ data: err })
//   }
// }
// const editBook = async (req, res) => {
//   try {
//     const id = req.params.id

//     // Find existing book
//     const existingBook = await Book.findById(id)

//     if (!existingBook) {
//       return res.status(404).send({
//         success: false,
//         message: 'Book not found'
//       })
//     }

//     // Get updated book details
//     const updatedData = { ...req.body }

//     // Upload new image only if user selects one
//     if (req.file) {
//       const upload = await cloudinary.uploader.upload(req.file.path)

//       updatedData.bookImage = upload.secure_url
//     }

//     // Update book details
//     await Book.updateOne({ _id: id }, { $set: updatedData })

//     res.status(200).send({
//       success: true,
//       message: 'Book Updated Successfully'
//     })
//   } catch (error) {
//     console.log('EDIT BOOK ERROR:', error)

//     res.status(400).send({
//       success: false,
//       message: error.message
//     })
//   }
// }


// const getBookById = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id)

//     if (!book) {
//       return res.status(404).send({
//         message: 'Book not found'
//       })
//     }

//     res.status(200).send({
//       data: book
//     })
//   } catch (error) {
//     console.log('GET BOOK BY ID ERROR:', error)

//     res.status(400).send({
//       message: error.message
//     })
//   }
// }


// module.exports = {
//   addBook,
//   getBooks,
//   deleteBook,
//   getBookForEdit,
//   editBook,
//   getBookById,
// }



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
