/*
  passport for authentication
  passport-github for github specific strategy
  user model for saving to user
*/
import passport from 'passport';
import github from 'passport-github';

import User from '../../models/user';

const GithubStrategy = github.Strategy;

// here we set up the github strategy and what it will do. we need to provide it
// the client id, client secret etc that we get when we create a new app on
// github. The passReqToCallback is important as it allows us to access
// everything the req so we can check if some user is already logged in and thus
// link accounts.
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  passReqToCallback: true
}, async(req, token, refreshToken, profile, done) => {
  // if the user is not available on req, we check if their id is in db. If it is,
  // we readd their token that we removed when unlinking the acoount, along with
  // some other details and save them back in the db. if the user not avaialble in
  // the db also, we create a new user and save to DB. if the user is logged in
  // (available on req), we just add the github details to their .github area in
  // the db, thus linking their accounts.
  if (!req.user) {
    try {
      const user = await User.findOne({'github.id': profile.id});
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
    } catch (e) {
      return done(e);
    }
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
}));