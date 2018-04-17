import express from 'express';
import colors from 'colors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import session from 'express-session';
import connect from 'connect-mongo';
import ejs from 'ejs';

import passportConfig from './config/passport';
import routes from './routes';

require('dotenv').config({path: 'variables.env'});

const mongoStore = connect(session);
const store = new mongoStore({url: process.env.DB, autoReconnect: true});
const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.DB, err => {
  err
    ? console.log(err)
    : console.log("Connected to DB!".cyan)
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  cookie: {
    secure: false
  },
  saveUninitialized: true,
  store
}));
// passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
})
app.use(routes);

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`.yellow.underline);
})