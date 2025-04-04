const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});

app.use((req, res) => {
    res.status(200).json({ message: 'Hello, World!' });
})

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app;