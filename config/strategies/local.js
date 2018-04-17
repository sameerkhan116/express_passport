/*
  passport for authentication
  passport-local for local authentication strategy
  user model for saving to user
*/
import passport from 'passport';
import local from 'passport-local';

import User from '../../models/user';

const LocalStrategy = local.Strategy;

// For local authentication, we wil need two strategies - login and signup.

/*
  require Local signup requires us to specify the username and password fields for the
  form that we are setting up. passReqToCallback makes the req available in the function
  the stratefy provides as the next argument.
*/
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async(req, email, password, done) => {
  try {
    const user = await User.findOne({'local.email': email});
    if (user) {
      return done(null, false, req.flash('signupMessage', 'That email already exists'));
    }
    if (req.user) {
      let user = req.user;
      user.local.email = email;
      user.local.password = user.generateHash(password);
      user.save(err => {
        if (err) {
          throw err;
        }
        return done(null, user);
      })
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
  } catch (e) {
    return done(e);
  }
}));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async(req, email, password, done) => {
  try {
    const user = User.findOne({'local.email': email});
    if (!user) {
      return done(null, false, req.flash('loginMessage', 'No user found.'));
    }
    if (!user.validPassword(password)) {
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password!'));
    }
    return done(null, user);

  } catch (e) {
    return done(e);
  }
}));