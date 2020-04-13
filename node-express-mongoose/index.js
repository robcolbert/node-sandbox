'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dbdemo-zack', ( ) => {
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

  app.param('userId', (req, res, next, userId) => {
    res.locals.user = {
      id: userId,
      username: 'acolbert',
      name: 'Zack',
      email: 'zcolbert416@gmail.com',
      bio: 'I play games and stuff. Because.'
    };
    return next();
  });

  app.post('/user', (req, res, next) => {
    console.log(req.body);

    let hash = crypto.createHash('sha256');
    hash.update(req.body.password);
    req.body.password = hash.digest('base64');

    User
    .create(req.body)
    .then((user) => {
      res.status(200).json({ user: user });
    })
    .catch((error) => {
      console.log('that fai0led', error);
      return next(error);
    });
  });

  app.get('/user/:userId/profile', (req, res) => {
    res.render('item');
  });

  app.get('/user/:userId/inbox', (req, res) => {
    res.render('item');
  });

  app.get('/user/:userId/notifications', (req, res) => {
    res.render('item');
  });


  app.get('/', function (req, res) {
    res.locals.items = [
      'One',
      'Two',
      'Green',
      'Trees'
    ];
    res.locals.viewTitle = 'Sample title';
    res.render('index');
  });

  app.listen(3000);
});