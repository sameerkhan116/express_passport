/*
  Same as github.js, please refer to that file for comments.
*/
import passport from 'passport';
import google from 'passport-google-oauth20';

import User from '../../models/user';

const GoogleStrategy = google.Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, async(req, token, refreshToken, profile, done) => {
  if (!req.user) {
    try {
      const user = await User.findOne({'google.id': profile.id});
      if (user) {
        if (!user.google.token) {
          user.google.token = token;
          user.google.name = profile.displayName;
          user.google.email = profile.emails[0].value;
          user.save(err => {
            if (err) {
              throw err;
            }
            return done(null, user);
          })
        }
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
    } catch (err) {
      return done(err);
    }
  } else {
    let user = req.user;
    user.google.id = profile.id;
    user.google.token = token;
    user.google.name = profile.displayName;
    user.google.email = profile.emails[0].value;
    user.save((err) => {
      if (err) {
        throw err;
      }
      return done(null, user);
    })
  }
}))