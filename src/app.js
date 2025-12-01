const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const rankRoutes = require('./routes/rank');
const matchRoutes = require('./routes/match');
const historyRoutes = require('./routes/history');
const previewRoutes = require('./routes/preview');

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://media.valorant-api.com"],
            connectSrc: ["'self'", "https://api.henrikdev.xyz", "https://valorant-api.com"],
            objectSrc: ["'none'"]
        }
    }
}));
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

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
app.use('/history', historyRoutes);
app.use('/summary', require('./routes/summary'));
app.use('/preview', previewRoutes);

module.exports = app;
