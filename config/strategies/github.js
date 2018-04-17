import passport from 'passport';
import github from 'passport-github';

import User from '../../models/user';

const GithubStrategy = github.Strategy;

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  passReqToCallback: true
}, (req, token, refreshToken, profile, done) => {
  process.nextTick(() => {
    if (!req.user) {
      User.findOne({
        'github.id': profile.id
      }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          if (!user.github.token) {
            user.github.token = token;
            user.github.name = profile.displayName;
            user.github.email = profile.emails[0].value;
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
          newUser.github.id = profile.id;
          newUser.github.token = token;
          newUser.github.name = profile.displayName;
          newUser.github.email = profile.emails[0].value;

          newUser.save((err) => {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          })
        }
      })
    } else {
      let user = req.user;
      user.github.id = profile.id;
      user.github.token = token;
      user.github.name = profile.displayName;
      user.github.email = profile.emails[0].value;
      user.save((err) => {
        if (err) {
          throw err;
        }
        return done(null, user);
      })
    }
  })
}))