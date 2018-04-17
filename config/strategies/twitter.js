/*
  Same as github.js, please refer to that file for comments.
*/
import passport from 'passport';
import twitter from 'passport-twitter';

import User from '../../models/user';

const TwitterStrategy = twitter.Strategy;

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CLIENT_ID,
  consumerSecret: process.env.TWITTER_CLIENT_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
  passReqToCallback: true
}, async(req, token, tokenSecret, profile, done) => {
  if (!req.user) {
    try {
      const user = await User.findOne({'twitter.id': profile.id});
      if (user) {
        if (!user.twitter.token) {
          user.twitter.token = token;
          user.twitter.username = profile.username;
          user.twitter.displayName = profile.displayName;
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
        newUser.twitter.id = profile.id;
        newUser.twitter.token = token;
        newUser.twitter.username = profile.username;
        newUser.twitter.displayName = profile.displayName;

        newUser.save((err) => {
          if (err) {
            throw err;
          }
          return done(null, newUser);
        })
      }
    } catch (e) {
      return done(e);
    }
  } else {
    let user = req.user;
    user.twitter.id = profile.id;
    user.twitter.token = token;
    user.twitter.username = profile.username;
    user.twitter.displayName = profile.displayName;
    user.save((err) => {
      if (err) {
        throw err;
      }
      return done(null, user);
    })
  }
}));