'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dbdemo', ( ) => {
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

  app.post('/user', (req, res, next) => {
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

  app.get('/user/:userId/profile', (req, res) => {
    res.render('user/profile');
  });

  app.get('/user/:userId/inbox', (req, res) => {
    res.render('user/inbox');
  });

  app.get('/user/:userId/notifications', (req, res) => {
    res.render('user/notifications');
  });

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.listen(3000);
});
