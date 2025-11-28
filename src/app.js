const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const rankRoutes = require('./routes/rank');
const matchRoutes = require('./routes/match');
const historyRoutes = require('./routes/history');

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https://media.valorant-api.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"]
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

module.exports = app;
