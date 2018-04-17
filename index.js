/*
  Express...
  bodyParser to log incoming post data from forms
  morgan for getting HTTP logs in terminal
  cookieParser for storing cookies on req.cookie. Cookies required for session management.
  passport for authentication.
  mongoose for connecting to MongoDB
  flash for flashing messages in case of errors in forms.
  session for storing session. Required to keep users logged in.
  connect for connecting mongodb with session.
  ejs for templapting.
  colors to add colors in the terminal
*/
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import session from 'express-session';
import connect from 'connect-mongo';
import ejs from 'ejs';
import colors from 'colors';

// our custom passport congifuration containing all the strategies.
import passportConfig from './config/passport';

// setting up routes which the app will use.
import localRoutes from './routes/localRoutes';
import githubRoutes from './routes/githubRoutes';
import twitterRoutes from './routes/twitterRoutes';
import googleRoutes from './routes/googleRoutes';

// for environment variables
require('dotenv').config({path: 'variables.env'});

// connect mongodb with session so that session is not lost when used closes set
// up the store with the url
const mongoStore = connect(session);
const store = new mongoStore({url: process.env.DB, autoReconnect: true});
const PORT = process.env.PORT;
const app = express();

// connect mongoose to the db
mongoose.connect(process.env.DB, err => {
  err
    ? console.log(err)
    : console.log("Connected to DB!".cyan)
});

// set view engine for the app. Here, we are using EJS.
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET, // required to sign the session cookies
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
  store
}));
// passportConfig(passport);
app.use(passport.initialize()); // required to initialize passport
app.use(passport.session()); // since our webpage uses persistent sessions
app.use(flash()); // flash middleware for flashing error messages

// Passing the routes
app.use(localRoutes);
app.use(githubRoutes);
app.use(twitterRoutes);
app.use(googleRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`.yellow.underline);
})