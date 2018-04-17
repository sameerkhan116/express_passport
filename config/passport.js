import passport from 'passport';
import local from 'passport-local';
import github from 'passport-github';
import twitter from 'passport-twitter';
import google from 'passport-google-oauth20';

import User from '../models/user';

const LocalStrategy = local.Strategy;
const GithubStrategy = github.Strategy;
const TwitterStrategy = twitter.Strategy;
const GoogleStrategy = google.Strategy;

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

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, (token, refreshToken, profile, done) => {
  User.findOne({
    'github.id': profile.id
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    } else {
      let newUser = new User();
      newUser.github.id = profile.id;
      newUser.github.token = token;
      newUser.github.name = profile.displayName;
      newUser.github.email = profile.emails[0].value;

      newUser.save(err => {
        if (err) {
          throw err;
        }
        return done(null, newUser);
      })
    }
  });
}))

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CLIENT_ID,
  consumerSecret: process.env.TWITTER_CLIENT_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL
}, (token, tokenSecret, profile, done) => {
  User.findOne({
    'twitter.id': profile.id
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    } else {
      let newUser = new User();
      newUser.twitter.id = profile.id;
      newUser.twitter.token = token;
      newUser.twitter.username = profile.username;
      newUser.twitter.displayName = profile.displayName;

      newUser.save(err => {
        if (err) {
          throw err;
        }
        return done(null, newUser);
      })
    }
  });
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (token, refreshToken, profile, done) => {
  User.findOne({
    'google.id': profile.id
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    } else {
      let newUser = new User();
      newUser.google.id = profile.id;
      newUser.google.token = token;
      newUser.google.name = profile.displayName;
      newUser.google.email = profile.emails[0].value;

      newUser.save((err) => {
        if (err) {
          throw err;
        }
        return done(null, newUser);
      })
    }
  })
}))