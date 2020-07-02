const express = require('express');
const Author = require('../models/Author');
const router = express.Router();

//All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name !=null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }
});

//New Authors Route
router.get('/new', (req, res) => 
    res.render('authors/new', { author: new Author })
);

//Create Author Route
router.post('/', (req, res) => {
    // const author = new Author({
    //     name: req.body.name
    // });
    // author.save((err, newAuthor) => {
    //     if(err){
    //         res.render('authors/new', {
    //             author: author,
    //             error: 'Error Creating Author'
    //         });
    //     } else {
    //         req.flash('success_msg', 'Author Created. Add Books');
    //         res.redirect('authors');
    //     };
    // });

    const { name } = req.body;
    let errors = [];

    //Check for Required Feilds
    if(!name){
        errors.push({ msg: 'Fill in the Name Field' });
    }
    
    //Redirect due to Error
    if (errors.length > 0){
        res.render('authors/new', {
            errors,
            name
        })
    } else {
        //Validation passed
        Author.findOne({ name: name })
        .then(author => {
            if(author){
                //User Exists
                errors.push({ msg: 'Author with this name is already registered'});
                res.render('authors/new', {
                    errors,
                    name
                });
            } else {
                const newAuthor = new Author({
                    name
                });
                newAuthor.save()
                    .then(author => {
                        req.flash('success_msg', 'Author Registered, please add books');
                        res.redirect('authors');
                    })
                    .catch(err => console.log(err))
            }
        })
    }
});

module.exports = router;