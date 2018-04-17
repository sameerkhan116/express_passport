import route from 'express';
import passport from 'passport';

const router = route.Router();

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

router.get('/connect/twitter', passport.authorize('twitter', {scope: 'email'}));

router.get('/connect/twitter/callback', passport.authorize('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

export default router;
