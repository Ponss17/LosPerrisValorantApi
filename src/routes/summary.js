const express = require('express');
const router = express.Router();
const { getPUUID, getMMRByPUUID, getMatchesByPUUID, getMMRHistoryByPUUID } = require('../utils/henrikApi');
const { formatRankData, formatMatchData, formatHistoryData } = require('../utils/formatters');

const CACHE_TTL = 300 * 1000;
const summaryCache = new Map();

router.get('/:region/:name/:tag', async (req, res) => {
    const { region, name, tag } = req.params;
    const cacheKey = `${region.toLowerCase()}:${name.toLowerCase()}:${tag.toLowerCase()}`;

    const cached = summaryCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`[CACHE HIT] ${cacheKey}`);
        return res.json(cached.data);
    }

    try {
        const accountData = await getPUUID(name, tag);

        if (accountData.status !== 200) {
            return res.status(accountData.status).json(accountData);
        }

        const puuid = accountData.data.puuid;

        const [mmrData, matchesData, historyData] = await Promise.all([
            getMMRByPUUID(region, puuid),
            getMatchesByPUUID(region, puuid, 'competitive'),
            getMMRHistoryByPUUID(region, puuid)
        ]);

        const responseData = {
            account: accountData.data,
            rank: null,
            match: null,
            history: null
        };

        if (mmrData.status === 200) {
            responseData.rank = formatRankData(accountData, mmrData);
        }

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];
            responseData.match = formatMatchData(lastMatch, puuid);
        }

        if (historyData.status === 200) {
            responseData.history = formatHistoryData(historyData);
        }

        const finalResponse = {
            status: 200,
            data: responseData
        };

        summaryCache.set(cacheKey, {
            timestamp: Date.now(),
            data: finalResponse
        });

        res.json(finalResponse);

    } catch (error) {
        const status = error.status || 500;
        let errorCode = 'SERVER_ERROR';
        let message = 'An unexpected error occurred';

        if (status === 404) {
            errorCode = 'USER_NOT_FOUND';
            message = 'Player not found';
        } else if (status === 429) {
            errorCode = 'RATE_LIMIT';
            message = 'Too many requests';
        } else if (status === 403) {
            errorCode = 'API_KEY_INVALID';
            message = 'Invalid API Key';
        }

        res.status(status).json({
            status: status,
            error: errorCode,
            message: message,
            details: error.data || error.message
        });
    }
});

module.exports = router;
