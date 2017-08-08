"use strict";
declare function require(string);
declare const __dirname;

import {idRoutes} from './app/id/id-routes';
require('app-module-path').addPath(__dirname + '/app');

const db = require('services/dbService');
const express = require('express');
const knex = require('knex');
const app = express();
const port = 4010;
app.get('/', function (req, res) {
  res.send('Hello Stranger!');
});

app.get('/increment', function (req, res) {
  res.send('increment');
});

idRoutes(app);

db.init(knex);

app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
