/*
  route from express for creating router module.
  passport for local authentication strategy.
*/
import route from 'express';
import passport from 'passport';

const router = route.Router();

// well clicking on the github button at the login page. This will redirect to
// /auth/github/callback. in scope, we are requesting for additional parameters
// in the returned object such as public profile and email.
router.get('/auth/github', passport.authenticate('github', {
  scope: ['public_profile', 'email']
}));

// use the github strategy that we setup and redirect accordingly.
router.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

// this route used for linking accounts on the profile page. passport.authorize
// checks if the user is stored in session and automically logs in, otherwise
// authenticate.
router.get('/connect/github', passport.authorize('github'));

// same as the other callback route above.
router.get('/connect/github/callback', passport.authorize('github', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

// to unlink the github account. Simply remove the token from the user in
// req.user and redirect to /profile.
router.get('/unlink/github', (req, res) => {
  var user = req.user;
  user.github.token = undefined;
  user.save(function (err) {
    res.redirect('/profile');
  });
});

export default router;
