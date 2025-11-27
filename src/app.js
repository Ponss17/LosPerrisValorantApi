const express = require('express');
const path = require('path');
const rankRoutes = require('./routes/rank');
const matchRoutes = require('./routes/match');

const app = express();

app.use(express.json());

// Middleware to handle /valorantapi prefix
app.use((req, res, next) => {
    if (req.url.startsWith('/valorantapi')) {
        req.url = req.url.replace('/valorantapi', '') || '/';
    }
    next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/rank', rankRoutes);
app.use('/match', matchRoutes);

module.exports = app;
