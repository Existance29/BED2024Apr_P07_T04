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