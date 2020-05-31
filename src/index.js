const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const path = require('path');
const passport = require('passport');
const OAuth1Strategy = require('passport-oauth1');
const OAuth = require('oauth');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

const app = express();

const AuthController = require('./controllers/authController');
const Routes = require('./routes');

const port = process.env.PORT || 8080;

require('dotenv').config();
const { env } = process;

app.use(express.static(path.join(__dirname, 'client/build')));

// cookieSession config
app.use(cookieSession({
  name: 'session',
  keys: [env.SESSION_KEY],
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({
  origin: [env.FRONTEND_URL],
  exposedHeaders: ['authorization'],
  credentials: true,
}));

app.use('/api', Routes);

passport.use('provider', new OAuth1Strategy({
  requestTokenURL: env.OAUTH_REQUEST_TOKEN_URL,
  accessTokenURL: env.OAUTH_ACCESS_TOKEN_URL,
  userAuthorizationURL: env.OAUTH_USER_AUTHORIZATION_URL,
  consumerKey: env.OAUTH_CONSUMER_KEY,
  consumerSecret: env.OAUTH_CONSUMER_SECRET,
  callbackURL: '/api/auth/redirect',
}, (token, tokenSecret, profile, done) => {
  const oauth = new OAuth.OAuth(
    env.OAUTH_REQUEST_TOKEN_URL,
    env.OAUTH_ACCESS_TOKEN_URL,
    env.OAUTH_CONSUMER_KEY,
    env.OAUTH_CONSUMER_SECRET,
    '1.0',
    null,
    'HMAC-SHA1',
  );

  oauth.post(
    env.OAUTH_USER_RESOURCE_URL,
    token,
    tokenSecret,
    null,
    null,
    async (err, data) => {
      if (err) {
        console.error(err);
      }

      AuthController.authenticateUsp(data, done);
    },
  );
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/api/auth/', passport.authenticate('provider'));

app.get('/api/auth/redirect', passport.authenticate('provider', {
  successRedirect: env.FRONTEND_URL,
  failureRedirect: '/api/auth/failure',
}));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build/index.html')));

// Docker Url
const backendUrl = `mongodb://${env.MONGO_DOCKER_URL}/${env.MONGO_DOCKER_DB}`;

mongoose.connect(backendUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
  if (err) {
    console.error('Failed to connect to mongo on startup - retrying in 1 sec', err);
  }
});

mongoose.connection.on('error', (e) => {
  console.error('Error connecting to MongoDB!');
  console.error(e);
});

mongoose.connection.on('open', () => {
  console.log('Connected successfuly to MongoDB!');
  app.listen(port, () => {
    console.log(`Now listening at port ${port} for requests!`);
  });
});