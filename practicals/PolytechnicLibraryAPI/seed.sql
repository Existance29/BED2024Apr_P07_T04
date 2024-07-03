CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY,
    username VARCHAR(255) UNIQUE,
    passwordHash VARCHAR(255),
    role VARCHAR(20), CHECK (role = 'member' OR role = 'librarian')
);

CREATE TABLE Books(
    book_id INT PRIMARY KEY IDENTITY,
    title VARCHAR(255),
    author VARCHAR(255),
    availability CHAR(1), CHECK(availability = 'Y' or availability = 'N')
)

INSERT INTO Books (title,author,availability) VALUES ('The Adventures of Huckleberry Finn', 'Mark Twain', 'N'); SELECT SCOPE_IDENTITY() AS book_id;
INSERT INTO Books (title,author,availability) VALUES ('The Scarlet Letter', 'Nathaniel Hawthorne', 'Y'); SELECT SCOPE_IDENTITY() AS book_id;
INSERT INTO Books (title,author,availability) VALUES ('David Copperfield', 'Charles Dickens', 'N'); SELECT SCOPE_IDENTITY() AS book_id;