import passport from 'passport';
import twitter from 'passport-twitter';

import User from '../../models/user';

const TwitterStrategy = twitter.Strategy;

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