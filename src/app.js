const express = require('express');
const path = require('path');
const rankRoutes = require('./routes/rank');
const matchRoutes = require('./routes/match');

const app = express();

app.use(express.json());
// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/rank', rankRoutes);
app.use('/match', matchRoutes);

module.exports = app;
