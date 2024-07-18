const Book = require('../models/book');

const getAllBooks = async(req, res) => {
    try {
        const books = await Book.getAllBooks();
        if (!books) {
            return res.status(404).send('No Books to retrieve');
        }
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: "Error in bookController: Could not get all books" });
    }
}

const updateBookAvailability = async(req, res) => {
    const bookId = parseInt(req.params.id);
    const { availability } = req.body;
    try {
        const checkBook = await Book.getBookById(bookId);
        if (!checkBook) {
            return res.status(404).send('Book not found');
        }
        const book = await Book.updateBookAvailability(bookId, availability);
        res.status(200).json(book);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error in bookController: Could not update book availability" });
    }
}

module.exports = {
    getAllBooks, 
    updateBookAvailability,
}
