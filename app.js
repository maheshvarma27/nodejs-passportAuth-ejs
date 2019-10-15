const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const dotenv = require('dotenv');
dotenv.config()

// Passport Config
require('./config/passport')(passport);

// ----------------mongodb atlas start---------------------------------
mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
 )
 .then(() => console.log('DB Connected'))
  mongoose.connection.on('error', err => {
     console.log('DB connection error: ${err.message}')
  });
 // -----------------mongodb atlas end------------------------------------


// EJS middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');  //we assigned our view engine to ejs

// Express body parser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

