const express = require('express');
const router = express.Router();
const { getMatchesByPUUID, getMMRByPUUID } = require('../utils/henrikApi');
const { getAccountData, handleRouteError } = require('../utils/helpers');
const { formatMatchData } = require('../utils/formatters');
const { formatMatchText } = require('../utils/textFormatters');

router.get('/last/:region/:name/:tag', async (req, res) => {
    const { region, name, tag } = req.params;

    try {
        const accountData = await getAccountData(name, tag, req, res);
        if (!accountData) return;

        const puuid = accountData.data.puuid;

        const [matchesData, mmrData] = await Promise.all([
            getMatchesByPUUID(region, puuid, 'competitive'),
            getMMRByPUUID(region, puuid)
        ]);

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];

            const stats = lastMatch.players.all_players.find(p => p.puuid === puuid);

            const totalShots = (stats.stats.headshots || 0) + (stats.stats.bodyshots || 0) + (stats.stats.legshots || 0);
            const hsPercentage = totalShots > 0 ? ((stats.stats.headshots / totalShots) * 100).toFixed(1) : 0;

            if (req.query.format === 'text') {
                const lang = req.query.lang || 'en';
                const type = req.query.type || '1';
                const meta = lastMatch.metadata;
                const isWin = lastMatch.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');

                const kda = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;
                const map = meta.map;
                const agent = stats.character;
                const mmrChange = (mmrData.status === 200) ? mmrData.data.current_data.mmr_change_to_last_game : 0;

                return res.send(formatMatchText(map, isWin, kda, hsPercentage, agent, mmrChange, lang, type));
            }

            res.json({
                status: 200,
                data: formatMatchData(lastMatch, puuid)
            });
        } else {
            if (req.query.format === 'text') {
                return res.send('No matches found');
            }
            res.status(matchesData.status).json({
                status: matchesData.status,
                message: 'No matches found or error fetching matches',
                data: matchesData.data
            });
        }

    } catch (error) {
        handleRouteError(req, res, error);
    }
});

module.exports = router;
