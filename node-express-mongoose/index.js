'use strict';

const path = require('path');

const dotenv = require('dotenv');
dotenv.config(path.join(__dirname, '.env.local'));

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect('mongodb://localhost/dbdemo', mongooseOptions, (err) => {
  if (err) {
    console.log('error connecting to MongoDB', error);
    process.exit(-1);
  }

  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    created: { type: Date, default: Date.now },
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  });

  var User = mongoose.model('User', UserSchema);

  var app = express();

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.param('userId', async (req, res, next, userId) => {
    let user = await User.findById(userId);
    if (!user) {
      let error = new Error('User not found.');
      error.code = 404;
      return next(error);
    }
    res.locals.user = user;
    return next();
  });

  app.post('/user', async (req, res, next) => {
    let hash = crypto.createHash('sha256');
    if (process.env.WEBAPP_PASSWORD_SALT) {
      hash.update(process.env.WEBAPP_PASSWORD_SALT);
    }
    hash.update(req.body.password);
    req.body.password = hash.digest('hex');

    let user;
    try {
      user = await User.create(req.body);
    } catch(error) {
      return next(error);
    }
    res.redirect(`/user/${user._id}`);
  });

  app.get('/user/:userId/profile', async (req, res) => {
    res.render('user/profile');
  });

  app.get('/user/:userId/inbox', async (req, res) => {
    res.render('user/inbox');
  });

  app.get('/user/:userId/notifications', async (req, res) => {
    res.render('user/notifications');
  });

  app.get('/', async (req, res) => {
    res.render('index');
  });

  app.listen(process.env.WEBAPP_BIND_ADDRESS, process.env.WEBAPP_BIND_PORT, (err) => {
    if (err) {
      console.log('failed to start ExpressJS', error);
      process.exit(-1);
    }
    console.log('mongobox ready to play with frens.');
  });
});