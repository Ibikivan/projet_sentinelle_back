const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const specs = require('./src/docs/swagger');
const cokieParser = require('cookie-parser');
const { testDBConnexion, syncDB } = require('./src/model');
const errorHandler = require('./src/middlewares/error.handler');
const citiesRoutes = require('./src/routes/cities.routes');
const usersRoutes = require('./src/routes/users.routes');
const authRoutes = require('./src/routes/auth.routes');

testDBConnexion()
syncDB()

const app = express();

app.use(cors({
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
    credentials: true,
}));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, null, {
    swaggerOptions: {
        withCredentials: true,
    }
}));

app.use(cokieParser());

app.use('/api/cities', citiesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;