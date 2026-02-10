const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/**
 * Check if username exists
 */
const isValid = (username) => {
  return users.some(user => user.username === username);
};

/**
 * Authenticate username & password
 */
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

/**
 * Task 7
 * Login as registered user
 */
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid login credentials"
    });
  }

  // Generate JWT
  const accessToken = jwt.sign(
    { username },
    "access",
    { expiresIn: "1h" }
  );

  // Save token & username in session
  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({
    message: "User successfully logged in"
  });
});

/**
 * Task 8
 * Add or modify book review
 */
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Initialize reviews if not exists
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update review by the same user
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully"
  });
});

/**
 * Task 9
 * Delete book review by logged-in user
 */
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully"
    });
  }

  return res.status(404).json({
    message: "Review not found for this user"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;