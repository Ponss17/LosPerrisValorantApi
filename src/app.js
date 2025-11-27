const express = require('express');
const rankRoutes = require('./routes/rank');
const matchRoutes = require('./routes/match');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Rutas
app.use('/rank', rankRoutes);
app.use('/match', matchRoutes);

app.get('/', (req, res) => {
    res.send('Valorant Rank API is running');
});

module.exports = app;
