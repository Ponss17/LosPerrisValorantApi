const express = require('express');
const router = express.Router();
const { formatRankText, formatMatchText } = require('../utils/textFormatters');

router.post('/', (req, res) => {
    const { type, data, lang, botType, botMatchType } = req.body;

    if (!data) {
        return res.status(400).json({ error: 'Missing data' });
    }

    try {
        if (type === 'rank') {
            const { rank, rr, elo, name, tag } = data;
            const user = `${name}#${tag}`;
            const text = formatRankText(rank, rr, elo, user, lang, botType);
            return res.json({ text });
        }

        if (type === 'match') {
            const { map, isWin, kda, hs, agent, mmrChange } = data;
            const text = formatMatchText(map, isWin, kda, hs, agent, mmrChange, lang, botMatchType);
            return res.json({ text });
        }

        return res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
        console.error('Preview Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
