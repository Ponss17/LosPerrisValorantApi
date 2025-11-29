const express = require('express');
const router = express.Router();
const { getPUUID, getMMRByPUUID, getMatchesByPUUID, getMMRHistoryByPUUID } = require('../utils/henrikApi');

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
            const currentData = mmrData.data.current_data;
            responseData.rank = {
                name: accountData.data.name,
                tag: accountData.data.tag,
                puuid: puuid,
                region: region,
                rank: currentData.currenttierpatched,
                rank_image: currentData.images.large,
                elo: currentData.elo,
                mmr_change: currentData.mmr_change_to_last_game,
                ranking_in_tier: currentData.ranking_in_tier,
                card: accountData.data.card
            };
        }

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];
            const stats = lastMatch.players.all_players.find(p => p.puuid === puuid);

            if (stats) {
                const totalShots = (stats.stats.headshots || 0) + (stats.stats.bodyshots || 0) + (stats.stats.legshots || 0);
                const hsPercentage = totalShots > 0 ? ((stats.stats.headshots / totalShots) * 100).toFixed(1) : 0;

                const agentName = stats.character;
                const agentIcon = stats.assets.agent.small;
                const agentImage = stats.assets.agent.bust || stats.assets.agent.full || agentIcon;

                responseData.match = {
                    ...lastMatch,
                    derived: {
                        hs_percent: hsPercentage,
                        agent_name: agentName,
                        agent_icon: agentIcon,
                        agent_image: agentImage
                    }
                };
            }
        }

        if (historyData.status === 200) {
            responseData.history = historyData.data.map(match => ({
                date: match.date,
                elo: match.elo,
                change: match.mmr_change_to_last_game,
                map: match.map.name
            })).reverse();
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
