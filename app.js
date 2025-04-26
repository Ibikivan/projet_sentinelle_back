const express = require('express');
const { testDBConnexion, syncDB } = require('./src/model');
const errorHandler = require('./src/middlewares/errorHandler');
const citiesRoutes = require('./src/routes/citiesRoutes');
const usersRoutes = require('./src/routes/usersRoutes');

testDBConnexion()
syncDB()

const app = express();
app.use(express.json());

app.use('/api/cities', citiesRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

module.exports = app;