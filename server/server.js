


require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// CORS middleware (before routes)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Session middleware (must be before passport and any routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: req.user.id,
    displayName: req.user.displayName,
    email: req.user.email,
    photo: req.user.photo,
  });
});

// User "database" for demo purposes (replace with real DB)
const users = {};

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  const user = users[id];
  done(null, user);
});

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  function(accessToken, refreshToken, profile, cb) {
    // Save or find user in DB here
    let user = users[profile.id];
    if (!user) {
      user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
      };
      users[profile.id] = user;
    }
    return cb(null, user);
  }
));

// Route to start OAuth with Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback route
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login',
    session: true,
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard'); // Redirect to frontend dashboard
  }
);

// Route for login failure
app.get('/login/failed', (req, res) => {
  res.status(401).send('Login failed');
});

// Route for dashboard (protected)
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/google');
  res.send(`
    <h1>Welcome, ${req.user.displayName}</h1>
    <p>Email: ${req.user.email}</p>
    <img src="${req.user.photo}" alt="profile" width="100"/>
    <br/><a href="/logout">Logout</a>
  `);
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Home route
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Register/Login with Google</a>');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});