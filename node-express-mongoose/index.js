// index.js (node-express-mongoose)
// Copyright (C) 2020 Rob Colbert
// License: MIT

'use strict';

const path = require('path');

/*
 * dotenv will read a "dotfile" into process.env
 *
 * This is how we define WEBAPP_BIND_ADDRESS, WEBAPP_BIND_PORT, and
 * WEBAPP_PASSWORD_SALT.
 *
 * You don't store those values in git because that's a security problem.
 * Instead, you manage a file named `.env.local` outside of git and deploy
 * it to your web servers when building your production server(s).
 */
const dotenv = require('dotenv');
dotenv.config(path.join(__dirname, '.env.local'));

/*
 * We'll be using the crypto module to hash user passwords with the SHA-256
 * algorithm.
 */
const crypto = require('crypto');

/*
 * ExpressJS provides the "web server" for the application.
 */
const express = require('express');
const bodyParser = require('body-parser');

/*
 * Mongoose provides the MongoDB database connection for the application.
 */
const mongoose = require('mongoose');

/*
 * We will be using the new URL parser so we don't get yelled at.
 * We will also be using the unified topology. Same reason.
 */
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/*
 * Connect to MongoDB. It's not worth starting the rest of the app if you can't
 * connect to the database.
 */
mongoose.connect('mongodb://localhost/dbdemo', mongooseOptions, (err) => {
  if (err) {
    console.log('error connecting to MongoDB', error);
    process.exit(-1);
  }

  /*
   * Declare the User model. This would normally be done in a separate file in a
   * separate directory. For now, just focus on how to do it.
   */

  const Schema = mongoose.Schema;

  /*
   * Define the User schema. The Mongoose model will be created from this.
   */
  const UserSchema = new Schema({
    // date/time when the user record was created
    created: { type: Date, default: Date.now },
    // the user's username/screen name/handle/whatever
    username: { type: String, required: true },
    // the user's hashed password
    password: { type: String, required: true },
    // the user's display name
    name: { type: String, required: true },
    // the user's profile bio
    bio: { type: String }, //<-- trailing comma
  });

  /*
   * Now, you register this Schema with Mongoose to create a Model. You are
   * ready to start creating and querying User records.
   */
  var User = mongoose.model('User', UserSchema);

  /*
   * Create the ExpressJS "app" instance.
   */
  var app = express();

  // Tell ExpressJS we're using the Pug view template engine
  app.set('view engine', 'pug');

  // Tell ExpressJS our Pug template files live in the views directory
  app.set('views', path.join(__dirname, 'views'));

  // Tell ExpressJS to use the JSON body parser middleware. This is what sees
  // JSON data in the HTTP request body and puts it onto `req.body` for you.
  app.use(bodyParser.json());

  // Tell ExpressJS to also use the URL-encoded <form> body parser. This is what
  // parses basic forms out of an HTTP request and puts them on `req.body` for
  // you.
  app.use(bodyParser.urlencoded({ extended: true }));

  // Tell ExpressJS any time we use a :userId parameter in a route to call this
  // middleware to resolve that parameter to an object on `res.locals`
  app.param('userId', async (req, res, next, userId) => {
    let user = await User.findById(userId);
    if (!user) {
      let error = new Error('User not found.');
      error.statusCode = 404;
      return next(error);
    }
    res.locals.user = user;
    return next();
  });

  // Declare our POST /user handler to create new User records in MongoDB.
  app.post('/user', async (req, res, next) => {

    // Hash the user's password by replacing it on req.body
    let hash = crypto.createHash('sha256');
    if (process.env.WEBAPP_PASSWORD_SALT) {
      hash.update(process.env.WEBAPP_PASSWORD_SALT);
    }
    hash.update(req.body.password);
    req.body.password = hash.digest('hex');

    // create the User record in the database
    let user;
    try {
      user = await User.create(req.body);
    } catch(error) {
      return next(error);
    }

    // redirect the user to their new profile URL
    res.redirect(`/user/${user._id}/profile`);
  });

  // GET /user/:userId/profile to serve up user profile views.
  app.get('/user/:userId/profile', async (req, res) => {
    res.render('user/profile');
  });

  // GET / (home page) handler
  app.get('/', async (req, res) => {
    res.render('index');
  });

  /*
   * Now, we're ready to bind ExpressJS and start accepting requests.
   */
  app.listen(process.env.WEBAPP_BIND_ADDRESS, process.env.WEBAPP_BIND_PORT, (err) => {
    if (err) {
      console.log('failed to start ExpressJS', error);
      process.exit(-1);
    }
    console.log('mongobox ready to play with frens.');
  });
});

/*
 * We'll be separating some of this out into it's own files, adding support for
 * TLS/SSL, securing the database connection, and more as the development of
 * this app continues.
 *
 * For now, just run `yarn` and then `yarn start` to start this web app and
 * be able to connect to it at: http://localhost:3000/
 */