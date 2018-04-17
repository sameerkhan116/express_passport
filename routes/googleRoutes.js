import route from 'express';
import passport from 'passport';

const router = route.Router();

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

router.get('/connect/google', passport.authorize('google', {
  scope: ['profile', 'email']
}));

router.get('/connect/google/callback', passport.authorize('google', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

export default router;
