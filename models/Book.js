const mongoose =  require('mongoose');
const path = require('path');

const coverImageBasePath = 'uploads/bookCovers';

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
});

BookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null ){
        return path.join('/', coverImageBasePath, this.coverImageName);
    }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
module.exports.coverImageBasePath = coverImageBasePath;