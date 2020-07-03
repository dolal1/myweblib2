if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//Libaries
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

const app = express();

//Passport Config
require('./config/passport')(passport);

//Connect to Mongo
mongoose.connect(process.env.DATABASE_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Taste the Mongo...'));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Declaring Static Folder
app.use(express.static('public'));

//Method Override
app.use(methodOverride('_method'));

// BodyParser
app.use(express.urlencoded({ limit: '10mb', extended: false }));

//Express Session Middleware
app.use(session({
    secret: 'secret cat',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
}); 

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/authors', require('./routes/authors'));
app.use('/books', require('./routes/books'));

const PORT = process.env.PORT || 3500;

app.listen(PORT, console.log(`Server started on port ${PORT}`));