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

const updateBook = async (req, res) => {
    const {username, password} = req.body

    try {
        //check if book exists
        //update book
    
        return res.status(201).json()
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
  }

module.exports = {getAllBooks, updateBook}
