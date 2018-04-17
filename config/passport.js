/*
  Passport for authentication,
  user from models to find and do db queries,
  dotenv to get environment variables.
*/
import passport from 'passport';

import User from '../models/user';

require('dotenv').config({path: 'variables.env'});

/*
  To maintain persistent login sessions. Authenticated user is serialized to the session.
  the user.id that we provide as the second argument in done is saved in session to keep
  user logged in and this is later extracted when we deserialize the user, or logout.
*/
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/*
  Deserialize user from session when logging out.
*/
passport.deserializeUser(async(id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (e) {
    return done(err);
  }
});

// I have written the strategies seperately so as to minimize the amount of code
// in one file.
require('./strategies/local');
require('./strategies/github');
require('./strategies/twitter');
require('./strategies/google');