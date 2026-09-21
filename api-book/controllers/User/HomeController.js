const Book = require('../../models/Book');

const getBooks = async (req, res) => {
    try {
        let books = await Book.find({})
        console.log(books, 'books');
        res.status(200).send({ data: books })
    } catch (err) {
        console.log(err);
        res.status(200).send({message: 'Something Went Wrong'})
    }
}

module.exports = {
    getBooks,
}