const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require('./connection');

const PeopleRoutes = require('./routes/people'),
      AccountRoutes = require('./routes/account');


var app = express();
app.use(bodyParser.json());

app.use('/people', PeopleRoutes);
app.use('/account', AccountRoutes);

app.listen(3000);