const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    }
    return res.status(400).send("Invalid ISBN");
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let filter_book = []
  for (let book of Object.values(books)) {
    if (book.author === author) {
        filter_book.push(book);
    }
  }
  return res.status(200).send(JSON.stringify(filter_book, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let filter_book = []
  for (let book of Object.values(books)) {
    if (book.title === title) {
        filter_book.push(book);
    }
  }
  return res.status(200).send(JSON.stringify(filter_book, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    let review = books[isbn].reviews;
    return res.status(200).send(JSON.stringify(review, null, 4));
  }
  
  return res.status(400).send("Invalid ISBN");
});

// Task 10
// Async/Await
async function getAllBooks() {
    return books;
}

public_users.get("/", async (req, res) => {
    try {
      let data = await getAllBooks();
      res.status(200).send(JSON.stringify(data, null, 4));
    } catch (err) {
      res.status(500).send(err);
    }
});

// Task 11
// Async/Await
async function getBookOnISBN(isbn) {
    if (books[isbn]) {
        return books[isbn];
    }
};

public_users.get('/isbn/:isbn', async (req, res) => {
    //Write your code here
    try {
        let isbn = req.params.isbn;
        let data = await getBookOnISBN(isbn);
        if (data) {
            return res.status(200).send(JSON.stringify(data, null, 4));
        }
        return res.status(400).send("Invalid ISBN")
    
    } catch (err) {
        res.status(500).send(err);
    }
});

// Task 12
// Async/Await
async function getBookOnAuthor(author) {
    let filter_book = [];
    for (let book of Object.values(books)) {
      if (book.author === author) {
          filter_book.push(book);
      }
    }
    return filter_book;
};

public_users.get('/author/:author', async (req, res) => {
    //Write your code here
    try {
        let author = req.params.author;
        let data = await getBookOnAuthor(author);
        res.status(200).send(JSON.stringify(data, null, 4));
    } catch (err) {
        res.status(500).send(err);
    }
});

// Task 13
// Async/Await
async function getBookOnTitle(title) {
    let filter_book = [];
    for (let book of Object.values(books)) {
      if (book.title === title) {
          filter_book.push(book);
      }
    }
    return filter_book;
};

public_users.get('/title/:title', async (req, res) => {
    //Write your code here
    try {
        let title = req.params.title;
        let data = await getBookOnTitle(title);
        res.status(200).send(JSON.stringify(data, null, 4));
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports.general = public_users;
