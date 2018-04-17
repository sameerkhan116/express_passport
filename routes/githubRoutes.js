import route from 'express';
import passport from 'passport';

const router = route.Router();

router.get('/auth/github', passport.authenticate('github', {
  scope: ['public_profile', 'email']
}));

router.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

router.get('/connect/github', passport.authorize('github'));

router.get('/connect/github/callback', passport.authorize('github', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

export default router;
