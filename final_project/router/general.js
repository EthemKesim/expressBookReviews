const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/* ======================
   Task 6 - Register
====================== */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

/* ======================
   Task 1 - Get all books
====================== */
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

/* ======================
   Task 2 - Get by ISBN
====================== */
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

/* ======================
   Task 3 - Get by Author
====================== */
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const result = [];

  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "No books found for this author" });
});

/* ======================
   Task 4 - Get by Title
====================== */
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const result = [];

  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

/* ======================
   Task 5 - Get Review
====================== */
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

/* =================================================
   Task 10 - Async/Axios Get All Books
================================================= */
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/* =================================================
   Task 11 - Async/Axios Get by ISBN
================================================= */
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(404).json({ message: "Book not found" });
  }
});

/* =================================================
   Task 12 - Async/Axios Get by Author
================================================= */
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

/* =================================================
   Task 13 - Async/Axios Get by Title
================================================= */
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

module.exports.general = public_users;