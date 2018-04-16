import passport from 'passport';
import local from 'passport-local';

import User from '../models/user';

const LocalStrategy = local.Strategy;

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

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({
    "local.email": email
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    } else {
      let newUser = new User();
      newUser.local.email = email;
      newUser.local.password = newUser.generateHash(password);
      newUser.save(err => {
        if (err) {
          throw err;
        }
        return done(null, newUser);
      });
    }
  });
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({
    'local.email': email
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, req.flash('loginMessage', 'No user found.'));
    }
    if (!user.validPassword(password)) {
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password!'));
    }
    return done(null, user);
  });
}));