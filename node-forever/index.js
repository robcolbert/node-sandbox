'use strict';

const express = require('express');

module.app = express();

module.app.get('/', (req, res) => {
  res.send('Change this text, save the file, then refresh the browser.');
});

module.app.listen(3000, (err) => {
  if (err) {
    console.log('failed to start ExpressJS', error);
    process.exit(-1);
  }
  console.log('now, what?');
});