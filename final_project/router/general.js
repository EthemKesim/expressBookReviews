const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * Check if a username already exists
 */
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  return userswithsamename.length > 0;
};

/**
 * Register a new user
 */
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({
        message: "User successfully registred. Now you can login"
      });
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// ======================================================
// Task 10
// Get the list of books using Promise callbacks + Axios
// ======================================================

function getBookList(){
  // Fetch all books from the API using Axios
  return new Promise((resolve,reject)=>{
    axios.get("http://localhost:5000/")
      .then(response => resolve(response.data))
      .catch(() => reject("Error fetching books"));
  });
}

// Route to return the list of books
public_users.get('/',function (req, res) {
  getBookList()
    .then(bk =>
      res.status(200).send(JSON.stringify(bk, null, 4))
    )
    .catch(err =>
      res.status(500).json({message: err})
    );
});


// ======================================================
// Task 11
// Get book details by ISBN using Promise callbacks + Axios
// ======================================================

function getFromISBN(isbn){
  // Fetch a specific book by ISBN from the API
  return new Promise((resolve,reject)=>{
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => resolve(response.data))
      .catch(() => reject("Unable to find book!"));
  });
}

// Route to return book details by ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn)
    .then(bk =>
      res.status(200).send(JSON.stringify(bk, null, 4))
    )
    .catch(error =>
      res.status(404).json({message:error})
    );
});


// ======================================================
// Task 12
// Get book details by Author using Promise callbacks + Axios
// ======================================================

function getFromAuthor(author){
  // Fetch all books from the API
  // Filter books based on the provided author name
  // Resolve with matching books or reject if none found
  return new Promise((resolve,reject)=>{
    axios.get("http://localhost:5000/")
      .then(response => {
        let output = [];
        let booksData = response.data;

        // Loop through all books and match author name
        for (let isbn in booksData) {
          if (booksData[isbn].author === author) {
            output.push(booksData[isbn]);
          }
        }

        if (output.length > 0) {
          resolve(output);
        } else {
          reject("Author not found");
        }
      })
      .catch(() => reject("Error fetching books"));
  });
}

// Route to return books by author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
    .then(result =>
      res.status(200).send(JSON.stringify(result, null, 4))
    )
    .catch(error =>
      res.status(404).json({ message: error })
    );
});


// ======================================================
// Task 13
// Get book details by Title using Promise callbacks + Axios
// ======================================================

function getFromTitle(title){
  // Fetch all books from the API
  // Filter books based on the provided title
  return new Promise((resolve,reject)=>{
    axios.get("http://localhost:5000/")
      .then(response => {
        let output = [];
        let booksData = response.data;

        // Loop through all books and match title
        for (let isbn in booksData) {
          if (booksData[isbn].title === title) {
            output.push(booksData[isbn]);
          }
        }

        if (output.length > 0) {
          resolve(output);
        } else {
          reject("Title not found");
        }
      })
      .catch(() => reject("Error fetching books"));
  });
}

// Route to return books by title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
    .then(result =>
      res.status(200).send(JSON.stringify(result, null, 4))
    )
    .catch(error =>
      res.status(404).json({message:error})
    );
});


// ======================================================
// Get book review (unchanged)
// ======================================================

public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

module.exports.general = public_users;