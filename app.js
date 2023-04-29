require('dotenv').config();

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User.js');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000*10 } // set to expire after 10 days
  }));

// Connect to MongoDB database
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Configure passport middleware
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create the user in the database
    const existingUser = await User.findOne({ email: profile.emails[0].value});
    if (existingUser) {
      (req,res)=>{

        res.redirect('/blogs')
      }
      return done(null, existingUser);
      
      
      
      
    }

    const newUser = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName, 
        email: profile.emails[0].value,
        image: profile.photos[0].value ? profile.photos[0].value : ''
    });
    await newUser.save();
    done(null, newUser);
    console.log(profile.firstName,profile.lastName)
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Define the routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile',"email"] }));

 app.get('/auth/google/callback',
  passport.authenticate('google',{ failureRedirect: '/auth/google/callback' }),
  (req, res) => {
  res.redirect('/');
  }
  );
 
 
  app.get('/blogs', (req, res) => {
    // Render the dashboard page for authenticated users
    res.send('this is blogs.')
  });
 
  app.get('/logout', (req, res) => {
    
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });
  // app.get('/logout', (req, res) => {
  //   req.session.  
  //   destroy((err)=>{
  //       if(err) {
  //           console.log(err)
  //       }
  //       else{
  //           res.redirect('/');
  //       }
  //   })
 
  // });

  // Start the server
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Server started on port ${port}`));