const express = require('express');
const Author = require('../models/Author');
const Book = require('../models/Book');
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

//Show Author route
router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        });
    } catch {
        res.redirect('/');
    }
});

//Edit Author Route
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });
    } catch {
        res.redirect('/authors');
    }
});

//Update Author route
router.put('/:id', async (req, res) => {
    let author
     try{
         author = await Author.findById(req.params.id);
         author.name = req.body.name;
         await author.save();
         res.redirect(`/authors/${author.id}`);
     }catch {
        if(author == null){
            res.redirect('/authors', {
                error_msg: 'Could not find specified Author'
            });
        } else {
            res.render('authors/edit',{
                author: author,
                error_msg: 'Could not Update Author'
             });
        }
     }
});

//Delete Author route
router.delete('/:id', async (req, res) => {
    let author
     try{
         author = await Author.findById(req.params.id)
         await author.remove()
         res.redirect('/authors')
     }catch {
        if(author == null){
            res.redirect('/', {
                error_msg: 'Could not find specified Author'
            });
        } else {
            res.redirect(`/authors/${author.id}`);
        }
     }
});

router.delete('/:id', (req, res) => {
    res.send('Delete Author ' + req.params.id);
});

module.exports = router;