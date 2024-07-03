const Book = require("../models/books")

const getAllBooks = async (req, res) => {
    try {
        //get books from db
        const books = await Book.getAllBooks()
        //check if books is null (there are no books)
        if (!books) return res.status(404).json({message: "No books found"})
        return res.status(201).json(books)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
  }

const updateBookAvailability = async (req, res) => {
    const id = req.params.bookId
    try {
        //check if book exists and get book from db
        const book = await Book.getBookByID(id)
        if (!book) return res.status(404).json({message: "Book not found"})
        
        //get the new availability (if Y -> N and vice versa)
        const newAvailability = book.availability === "Y" ? "N" : "Y"
        //update book availability
        Book.updateBookAvailability(id, newAvailability)
        
        return res.status(201).json({message: "Book availability successfully updated"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
  }

module.exports = {getAllBooks, updateBookAvailability}
