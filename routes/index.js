const express = require('express');
const router = express.Router();
const Book = require('../models/Book')
const { ensureAuthenticated } = require('../config/userAuth');

//Index Page
router.get('/', (req, res) => res.render('index'));

//Daashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        name: req.user.name
    }));

//Welcome Page
router.get('/welcome', async (req, res) => {
    let books
    try {
        books = await Book.find()
                          .sort({ createdAt: 'desc' })
                          .limit(10)
                          .exec();
    } catch {
        books = [];
    }
    res.render('welcome', { 
        books: books
    });
});

module.exports = router;