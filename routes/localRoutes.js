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
  .route('/signup')
  .get((req, res) => {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  })
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

router
  .route('/connect/local')
  .get((req, res) => {
    res.render('connect-local.ejs', {
      message: req.flash('loginMessage')
    });
  })
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile ',
    failureRedirect: '/connect/local',
    failureFlash: true
  }));

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile.ejs', {user: req.user});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;