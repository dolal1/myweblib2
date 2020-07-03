const mongoose =  require('mongoose');
const Book = require('./Book');

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

AuthorSchema.pre('remove', function(next){
    Book.find({ author: this.id }, (err, books) => {
        if(err){
            next(err);
        } else if (books.length > 0){
            next(new Error('This author has books still'));
        } else {
            next();
        }
    });
});

const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;