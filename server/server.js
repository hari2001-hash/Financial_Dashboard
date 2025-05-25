
// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const app = express();

// // MongoDB connection
// const MONGO_URI = process.env.MONGO_URI || 'your-mongo-uri-here';
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected!'))
//   .catch(err => console.log('MongoDB connection error:', err));

// // Registration schema/model
// const registerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   phone: String,
//   // Add more fields as needed
// });
// const Register = mongoose.model('Register', registerSchema);

// // CORS middleware (before routes)
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// // JSON body parser (for POST requests)
// app.use(express.json());

// // Session middleware (must be before passport and any routes)
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'secret',
//   resave: false,
//   saveUninitialized: false,
// }));

// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/api/user', (req, res) => {
//   if (!req.isAuthenticated || !req.isAuthenticated()) {
//     return res.status(401).json({ error: 'Not authenticated' });
//   }
//   res.json({
//     id: req.user.id,
//     displayName: req.user.displayName,
//     email: req.user.email,
//     photo: req.user.photo,
//   });
// });

// // User "database" for demo purposes (replace with real DB)
// const users = {};

// // Serialize user
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user
// passport.deserializeUser((id, done) => {
//   const user = users[id];
//   done(null, user);
// });

// // Configure Google OAuth Strategy
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL,
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     // Save or find user in DB here
//     let user = users[profile.id];
//     if (!user) {
//       user = {
//         id: profile.id,
//         displayName: profile.displayName,
//         email: profile.emails[0].value,
//         photo: profile.photos[0].value,
//       };
//       users[profile.id] = user;
//     }
//     return cb(null, user);
//   }
// ));

// // Route to start OAuth with Google
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google callback route
// app.get('/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: 'http://localhost:3000/login',
//     session: true,
//   }),
//   (req, res) => {
//     res.redirect('http://localhost:3000/dashboard'); // Redirect to frontend dashboard
//   }
// );

// // Route for login failure
// app.get('/login/failed', (req, res) => {
//   res.status(401).send('Login failed');
// });

// // Route for dashboard (protected)
// app.get('/dashboard', (req, res) => {
//   if (!req.isAuthenticated()) return res.redirect('/auth/google');
//   res.send(`
//     <h1>Welcome, ${req.user.displayName}</h1>
//     <p>Email: ${req.user.email}</p>
//     <img src="${req.user.photo}" alt="profile" width="100"/>
//     <br/><a href="/logout">Logout</a>
//   `);
// });

// // Logout route
// app.get('/logout', (req, res) => {
//   req.logout(() => {
//     res.redirect('/');
//   });
// });

// // Home route
// app.get('/', (req, res) => {
//   res.send('<a href="/auth/google">Register/Login with Google</a>');
// });

// // ===== Registration endpoint for custom form =====
// app.post('/api/register', async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Name, email, and password are required.' });
//     }
//     const newUser = new Register({ name, email, password, phone });
//     await newUser.save();
//     res.status(201).json({ message: 'Registration successful!' });
//   } catch (err) {
//     res.status(500).json({ error: 'Registration failed.' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });









// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const app = express();

// // MongoDB connection
// const MONGO_URI = process.env.MONGO_URI || 'your-mongo-uri-here';
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected!'))
//   .catch(err => console.log('MongoDB connection error:', err));

// // Registration schema/model (supports both normal and OAuth users)
// const registerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String, // nullable for OAuth users
//   phone: String,
//   oauthProvider: String, // e.g., "google"
//   oauthId: String,       // Google profile id
//   photo: String          // profile photo URL
// });
// const Register = mongoose.model('Register', registerSchema);

// // CORS middleware (before routes)
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// // JSON body parser (for POST requests)
// app.use(express.json());

// // Session middleware (must be before passport and any routes)
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'secret',
//   resave: false,
//   saveUninitialized: false,
// }));

// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/api/user', (req, res) => {
//   if (!req.isAuthenticated || !req.isAuthenticated()) {
//     return res.status(401).json({ error: 'Not authenticated' });
//   }
//   res.json({
//     id: req.user._id,
//     displayName: req.user.name || req.user.displayName,
//     email: req.user.email,
//     photo: req.user.photo,
//     oauthProvider: req.user.oauthProvider,
//   });
// });

// // Serialize user by mongo _id
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// // Deserialize user by mongo _id
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await Register.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // Configure Google OAuth Strategy with DB save
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL,
//   },
//   async function(accessToken, refreshToken, profile, cb) {
//     try {
//       // Try to find user in DB by provider and id
//       let user = await Register.findOne({ oauthProvider: 'google', oauthId: profile.id });
//       if (!user) {
//         // If not found, create a new user
//         user = await Register.create({
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           oauthProvider: 'google',
//           oauthId: profile.id,
//           photo: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "",
//         });
//       }
//       return cb(null, user);
//     } catch (err) {
//       return cb(err, null);
//     }
//   }
// ));

// // Route to start OAuth with Google
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google callback route
// app.get('/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: 'http://localhost:3000/login',
//     session: true,
//   }),
//   (req, res) => {
//     res.redirect('http://localhost:3000/dashboard'); // Redirect to frontend dashboard
//   }
// );

// // Route for login failure
// app.get('/login/failed', (req, res) => {
//   res.status(401).send('Login failed');
// });

// // Route for dashboard (protected)
// app.get('/dashboard', (req, res) => {
//   if (!req.isAuthenticated()) return res.redirect('/auth/google');
//   res.send(`
//     <h1>Welcome, ${req.user.name || req.user.displayName}</h1>
//     <p>Email: ${req.user.email}</p>
//     <img src="${req.user.photo}" alt="profile" width="100"/>
//     <br/><a href="/logout">Logout</a>
//   `);
// });

// // Logout route
// app.get('/logout', (req, res) => {
//   req.logout(() => {
//     res.redirect('/');
//   });
// });

// // Home route
// app.get('/', (req, res) => {
//   res.send('<a href="/auth/google">Register/Login with Google</a>');
// });

// // ===== Registration endpoint for custom form =====
// app.post('/api/register', async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Name, email, and password are required.' });
//     }
//     // Ensure not already registered with this email (either normal or OAuth)
//     const exists = await Register.findOne({ email });
//     if (exists) {
//       return res.status(409).json({ error: 'Email already registered.' });
//     }
//     const newUser = new Register({ name, email, password, phone });
//     await newUser.save();
//     res.status(201).json({ message: 'Registration successful!' });
//   } catch (err) {
//     res.status(500).json({ error: 'Registration failed.' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });





// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const app = express();

// // MongoDB connection
// const MONGO_URI = process.env.MONGO_URI || 'your-mongo-uri-here';
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected!'))
//   .catch(err => console.log('MongoDB connection error:', err));

// // Registration schema/model (supports both normal and OAuth users)
// const registerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String, // nullable for OAuth users
//   phone: String,
//   oauthProvider: String, // e.g., "google"
//   oauthId: String,       // Google profile id
//   photo: String          // profile photo URL
// });
// const Register = mongoose.model('Register', registerSchema);

// // CORS middleware (before routes)
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// // JSON body parser (for POST requests)
// app.use(express.json());

// // Session middleware (must be before passport and any routes)
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'secret',
//   resave: false,
//   saveUninitialized: false,
// }));

// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());

// // Serialize user by mongo _id
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// // Deserialize user by mongo _id
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await Register.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // Configure Google OAuth Strategy with DB save
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL,
//   },
//   async function(accessToken, refreshToken, profile, cb) {
//     try {
//       // Try to find user in DB by provider and id
//       let user = await Register.findOne({ oauthProvider: 'google', oauthId: profile.id });
//       if (!user) {
//         // If not found, create a new user
//         user = await Register.create({
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           oauthProvider: 'google',
//           oauthId: profile.id,
//           photo: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "",
//         });
//       }
//       return cb(null, user);
//     } catch (err) {
//       return cb(err, null);
//     }
//   }
// ));

// // Route to start OAuth with Google
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google callback route
// app.get('/auth/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: 'http://localhost:3000/login',
//     session: true,
//   }),
//   (req, res) => {
//     res.redirect('http://localhost:3000/dashboard'); // Redirect to frontend dashboard
//   }
// );

// // Route for login failure
// app.get('/login/failed', (req, res) => {
//   res.status(401).send('Login failed');
// });

// // ======= LOGIN ENDPOINT =======
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Only allow login for non-OAuth (form) users
//     const user = await Register.findOne({ email, oauthProvider: { $exists: false } });
//     if (!user || user.password !== password) {
//       return res.status(401).json({ error: "Invalid email or password." });
//     }
//     req.login(user, (err) => {
//       if (err) return res.status(500).json({ error: "Login failed." });
//       return res.status(200).json({
//         message: "Login successful!",
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//         }
//       });
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error.' });
//   }
// });

// // API: get current user info (for frontend session check)
// app.get('/api/user', (req, res) => {
//   if (!req.isAuthenticated || !req.isAuthenticated()) {
//     return res.status(401).json({ error: 'Not authenticated' });
//   }
//   res.json({
//     id: req.user._id,
//     displayName: req.user.name || req.user.displayName,
//     email: req.user.email,
//     photo: req.user.photo,
//     oauthProvider: req.user.oauthProvider,
//   });
// });

// // Route for dashboard (protected)
// app.get('/dashboard', (req, res) => {
//   if (!req.isAuthenticated || !req.isAuthenticated()) return res.redirect('/login');
//   res.send(`
//     <h1>Welcome, ${req.user.name || req.user.displayName}</h1>
//     <p>Email: ${req.user.email}</p>
//     <img src="${req.user.photo || ''}" alt="profile" width="100"/>
//     <br/><a href="/logout">Logout</a>
//   `);
// });

// // Logout route
// app.get('/logout', (req, res) => {
//   req.logout(() => {
//     res.redirect('/');
//   });
// });

// // Home route
// app.get('/', (req, res) => {
//   res.send('<a href="/auth/google">Register/Login with Google</a>');
// });

// // ===== Registration endpoint for custom form =====
// app.post('/api/register', async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Name, email, and password are required.' });
//     }
//     // Ensure not already registered with this email (either normal or OAuth)
//     const exists = await Register.findOne({ email });
//     if (exists) {
//       return res.status(409).json({ error: 'Email already registered.' });
//     }
//     const newUser = new Register({ name, email, password, phone });
//     await newUser.save();
//     res.status(201).json({ message: 'Registration successful!' });
//   } catch (err) {
//     res.status(500).json({ error: 'Registration failed.' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Only allow login for non-OAuth (form) users
//     const user = await Register.findOne({ email, oauthProvider: { $exists: false } });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password." });
//     }
//     if (user.password !== password) {
//       return res.status(401).json({ error: "Invalid email or password." });
//     }

//     req.login(user, (err) => {
//       if (err) {
//         console.error("Passport req.login error:", err);
//         return res.status(500).json({ error: "Login failed." });
//       }
//       return res.status(200).json({
//         message: "Login successful!",
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//         }
//       });
//     });
//   } catch (err) {
//     console.error("Login server error:", err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// });
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });




require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'your-mongo-uri-here';
// You can remove deprecated options:
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB connection error:', err));

// Registration schema/model (supports both normal and OAuth users)
const registerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // nullable for OAuth users
  phone: String,
  oauthProvider: String, // e.g., "google"
  oauthId: String,       // Google profile id
  photo: String          // profile photo URL
});
const Register = mongoose.model('Register', registerSchema);

// CORS middleware (before routes)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// JSON body parser (for POST requests)
app.use(express.json());

// Session middleware (must be before passport and any routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serialize user by mongo _id
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user by mongo _id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Register.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google OAuth Strategy with DB save
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Try to find user in DB by provider and id
      let user = await Register.findOne({ oauthProvider: 'google', oauthId: profile.id });
      if (!user) {
        // If not found, create a new user
        user = await Register.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          oauthProvider: 'google',
          oauthId: profile.id,
          photo: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "",
        });
      }
      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }
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

// ======= LOGIN ENDPOINT (keep only one) =======
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Only allow login for non-OAuth (form) users
    const user = await Register.findOne({ email, oauthProvider: { $exists: false } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    req.login(user, (err) => {
      if (err) {
        console.error("Passport req.login error:", err);
        return res.status(500).json({ error: "Login failed." });
      }
      return res.status(200).json({
        message: "Login successful!",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    });
  } catch (err) {
    console.error("Login server error:", err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// API: get current user info (for frontend session check)
app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: req.user._id,
    displayName: req.user.name || req.user.displayName,
    email: req.user.email,
    photo: req.user.photo,
    oauthProvider: req.user.oauthProvider,
  });
});

// Route for dashboard (protected)
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.redirect('/login');
  res.send(`
    <h1>Welcome, ${req.user.name || req.user.displayName}</h1>
    <p>Email: ${req.user.email}</p>
    <img src="${req.user.photo || ''}" alt="profile" width="100"/>
    <br/><a href="/logout">Logout</a>
  `);
});

// Logout route
app.get('/logout', (req, res) => {
  // If you're using Passport 0.6+, you can use callback
  req.logout(() => {
    res.redirect('/');
  });
  // Otherwise, for older versions:
  // req.logout();
  // res.redirect('/');
});

// Home route
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Register/Login with Google</a>');
});

// ===== Registration endpoint for custom form =====
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    // Ensure not already registered with this email (either normal or OAuth)
    const exists = await Register.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const newUser = new Register({ name, email, password, phone });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
});


const transactionsRouter = require("./routes/Transaction");
app.use("/api/transactions", transactionsRouter);

const uploadStatementRouter = require("./routes/UploadStatement");
app.use("/api/upload-statement", uploadStatementRouter);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});