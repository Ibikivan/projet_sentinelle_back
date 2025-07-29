const envVarTest = require('./src/config/env-config');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./src/docs/swagger');
const cokieParser = require('cookie-parser');
const { testDBConnexion, syncDB } = require('./src/model');
const errorHandler = require('./src/middlewares/error-handler.middleware');
const citiesRoutes = require('./src/routes/cities.routes');
const usersRoutes = require('./src/routes/users.routes');
const authRoutes = require('./src/routes/auth.routes');
const prayerRoutes = require('./src/routes/prayers.routes');
const testimonyRoutes = require('./src/routes/testimonies.routes');
const commentRoutes = require('./src/routes/comments.routes');

envVarTest()
testDBConnexion()
syncDB()

const app = express();

app.use(cors({
    origin: [
        process.env.FRONTEND_ENDPOINT,
        process.env.BACKEND_ENDPOINT
    ],
    credentials: true,
}));

app.use(express.json());
app.use(cokieParser());

app.use('/api/cities', citiesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', prayerRoutes);
app.use('/api/testimonies', testimonyRoutes);
app.use('/api/comments', commentRoutes)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, null, {
    swaggerOptions: { withCredentials: true }
}));

app.use((req, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'Route inconnue' }));
app.use(errorHandler);

module.exports = app;