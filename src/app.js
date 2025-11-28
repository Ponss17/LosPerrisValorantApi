const express = require('express');
const path = require('path');
const rankRoutes = require('./routes/rank');
const matchRoutes = require('./routes/match');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    if (req.url.startsWith('/valorantapi')) {
        req.url = req.url.replace('/valorantapi', '') || '/';
    }
    next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.use('/rank', rankRoutes);
app.use('/match', matchRoutes);

module.exports = app;
