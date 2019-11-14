const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require('./connection');

const routes = require('./routes/routes');


var app = express();
app.use(bodyParser.json());

app.use('/automation', routes);

app.listen(3000);