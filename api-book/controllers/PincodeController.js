const BookAtPlace = require('../models/BookAtPlace')
const Book = require('../models/Book')

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

const getPincodes = async (req, res) => {
  try {
    let pincodes = await BookAtPlace.find({}).populate('book');
    res.status(200).send({ data: pincodes});  
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: 'Something Went Wrong' })
  }
}


const addBookAtPlace = async (req, res) => {
  try {
    const { book, pinCode, isAvailable } = req.body

    if (!book) {
      return res.status(400).json({
        success: false,
        message: 'Book is required'
      })
    }

    if (!pinCode) {
      return res.status(400).json({
        success: false,
        message: 'PinCode is required'
      })
    }

    if (!/^\d{6}$/.test(pinCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit pincode'
      })
    }

    const existing = await BookAtPlace.findOne({
      book: book,
      pinCode: pinCode
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This pincode already exists for this book'
      })
    }

    const bookAtPlace = new BookAtPlace({
      book: book,
      pinCode: pinCode,
      isAvailable: isAvailable
    })

    const data = await bookAtPlace.save()

    return res.status(201).json({
      success: true,
      message: 'Pincode added successfully',
      data: data
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

// Check pincode for a particular book
const checkBookPincode = async (req, res) => {
  try {
    const { book, pinCode } = req.body

    if (!book || !pinCode) {
      return res.status(400).json({
        success: false,
        message: 'Book and pincode are required'
      })
    }

    if (!/^\d{6}$/.test(pinCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit pincode'
      })
    }

    const data = await BookAtPlace.findOne({
      book: book,
      pinCode: pinCode
    })

    if (!data) {
      return res.status(200).json({
        success: false,
        isAvailable: false,
        message: 'Delivery is not available at this pincode'
      })
    }

    if (data.isAvailable === true) {
      return res.status(200).json({
        success: true,
        isAvailable: true,
        message: 'Delivery is available at this pincode'
      })
    }

    return res.status(200).json({
      success: false,
      isAvailable: false,
      message: 'Delivery is not available at this pincode'
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

const getPincodeById = async (req, res) => {
  try {
    const data = await BookAtPlace.findById(req.params.id).populate(
      'book',
      'bookTittle'
    )

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found'
      })
    }

    res.status(200).json({
      success: true,
      data: data
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

const editPincode = async (req, res) => {
  try {
    const { book, pinCode, isAvailable } = req.body

    if (!book) {
      return res.status(400).json({
        success: false,
        message: 'Book is required'
      })
    }

    if (!/^\d{6}$/.test(pinCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit pincode'
      })
    }

    const data = await BookAtPlace.findByIdAndUpdate(
      req.params.id,
      {
        book: book,
        pinCode: pinCode,
        isAvailable: isAvailable
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Pincode not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Pincode updated successfully',
      data: data
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}


module.exports = {
  addBookAtPlace,
  checkBookPincode,
  getPincodes,
  getPincodeById,
  editPincode,
}
