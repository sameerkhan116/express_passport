import passport from 'passport';
import local from 'passport-local';

import User from '../../models/user';

const LocalStrategy = local.Strategy;

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  process.nextTick(() => User.findOne({
    "local.email": email
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
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
  }))
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