import route from 'express';
import passport from 'passport';

const router = route.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.get('/', (req, res) => {
  res.render('landing.ejs');
});

router
  .route('/login')
  .get((req, res) => {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  })
  .post(passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

router
// .route('/signup')
  .get('/signup', (req, res) => {
  res.render('signup.ejs', {
    message: req.flash('signupMessage')
  });
})
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('users/profile', {user: req.user});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;