const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookSchema = new Schema({
    bookTitle: { type: String, required: true },
    authorName: { type: String, required: true },
    price: { type: Number, required: true },
    isbnNo: { type: String, required: true },
    nop: { type: Number, required: true },
    publication: { type: String, required: true },
    bookImage: { type: String, required: true },
})

module.exports = mongoose.model('Book', bookSchema)