import passport from 'passport';
import google from 'passport-google-oauth20';

import User from '../../models/user';

const GoogleStrategy = google.Strategy;

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