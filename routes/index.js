const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/userAuth');

//Index Page
router.get('/', (req, res) => res.render('index'));

//Daashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        name: req.user.name
    }));

//Welcome Page
router.get('/welcome', (req, res) => res.render('welcome'));


module.exports = router;