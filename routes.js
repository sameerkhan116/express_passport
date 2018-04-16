const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

export default(app, passport) => {
  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  app
    .route('/login')
    .get((req, res) => {
      res.render('login.ejs', {
        message: req.flash('loginMessage')
      });
    })
  // .post(());

  app
    .route('/signup')
    .get((req, res) => {
      res.render('signup.ejs', {
        message: req.flash('signupMessage')
      });
    })
  // .post();

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {user: req.user});
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
}