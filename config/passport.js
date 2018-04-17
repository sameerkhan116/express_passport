import passport from 'passport';

import User from '../models/user';

require('dotenv').config({path: 'variables.env'});

/*
To maintain persistent login sessions. Authenticated user is serialized to the session.
*/
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/*
Deserialize user from session when logging out.
*/
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

require('./strategies/local');
require('./strategies/github');
require('./strategies/twitter');
require('./strategies/google');