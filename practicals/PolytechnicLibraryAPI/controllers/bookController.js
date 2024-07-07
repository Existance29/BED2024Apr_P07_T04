const Book = require('../model/book');

const getAllBooks = async(req, res) => {
    try {
        const books = await User.getAllBooks();
        if (!books) {
            return res.status(404).send('No Books to retrieve');
        }
        res.status(200).json({ title, author, availability });
    } catch (error) {
        throw new Error("Error in bookController: Could not get all books");
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
        const books = await Book.updateBookAvailability(bookId, availability);
        res.status(books).json({ title, author, availability });        
    } catch (error) {
        throw new Error("Error in bookController: Could not get all books");
    }
}

module.exports = {
    getAllBooks, 
    updateBookAvailability,
}