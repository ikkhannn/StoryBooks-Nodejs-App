const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const indexRoutes = require('./routes/index');
const connectDB = require('./config/db');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

//load config

dotenv.config({path:'./config/config.env'});

//passport config

require('./config/passport')(passport)

connectDB();

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// handlebars
app.engine('.hbs',exphbs({defaultLayout:'main', extname:'.hbs'}));
app.set('view engine','.hbs');

// Sessions

app.use(session({
    secret: 'kitty cat',
    resave: false,
    saveUninitialized: false
}))


// Passport middleware

app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname,'public')));

//  Routes
app.use('/',indexRoutes);
app.use('/auth',require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
