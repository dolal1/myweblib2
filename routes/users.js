const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

//User Model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) =>{
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check for Required Feilds
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Fill all the fields bro' });
    }

    //Check Passwords match
    if(password !== password2){
        errors.push({ msg: "Your passwords don't match" });
    }

    //Check password length
    if(password.length < 6){
        errors.push({ msg: 'Password are short. 6 or more characters' });
    }

    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //Validation passed
        User.findOne({ email: email })
        .then(user => {
            if(user){
                //User Exists
                errors.push({ msg: 'Email is already reqistered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                //hash Password
                bcrypt.genSalt(10, 
                    (err, salt) => bcrypt.hash(newUser.password, salt, 
                        (err, hashed) => {
                            if(err) throw err;
                            //Set User password to hashed
                            newUser.password = hashed;
                            //Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now Registered, please log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                            }))
            }
        })
    }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Your Out of the System');
    res.redirect('/users/login');
})

module.exports = router;