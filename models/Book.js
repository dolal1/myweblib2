const mongoose =  require('mongoose');

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType:{
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
    if(this.coverImage != null && this.coverImageType != null ){
        return `data: ${this.coverImageType};
                      charset:utf-8;base64,
                      ${this.coverImage.toString('base64')}`;
    }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;