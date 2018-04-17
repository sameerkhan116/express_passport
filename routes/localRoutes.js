/*
  route from express for creating router module.
  passport for local authentication strategy.
*/
import route from 'express';
import passport from 'passport';

const router = route.Router();

// this functions check if req has isAuthenticated attached to it (which is
// provided by passport) if it does then user is authenticated, otherwise
// redirect user to landing page.
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

/* Local Login routes -------------------------- */

// Render landing page on root
router.get('/', (req, res) => {
  res.render('landing.ejs');
});

// render login.ejs on /login. Also pass any error messages it may receive (it
// my receive error messages from passport strategy)
router
  .route('/login')
  .get((req, res) => {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  })
  // on post at this route, use the local-login strategy that we created and
  // redirect accordingly
  .post(passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

// render signup.ejs on /signup. Also pass any error messages it may receive (it
// my receive error messages from passport strategy)
router
  .route('/signup')
  .get((req, res) => {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  })
  // on post at this route, use the local - login strategy that we created and
  // redirect accordingly
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

// This route is used when attempting to connect local account to social
// accounts on the profile page. Process is same as in /login above.
router
  .route('/connect/local')
  .get((req, res) => {
    res.render('connect-local.ejs', {
      message: req.flash('loginMessage')
    });
  })
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/connect/local',
    failureFlash: true
  }));

// used to unlink the local account with social accounts. We just set the users
// email and password to undefined and it is automatically garbage collected and
// removed. We can then redirect back to /profile.
router.get('/unlink/local', (req, res) => {
  let user = req.user;
  user.local.email = undefined;
  user.local.password = undefined;
  user.save((err) => {
    res.redirect('/profile');
  })
})

// /profile is a protected route and only if the isLoggedin middleware that we
// defined earlier return true, we can access this.
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile.ejs', {user: req.user});
});

// use req.logout available from pasport to logout the current user.
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;