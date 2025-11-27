const express = require('express');
const router = express.Router();
const { getAccount, getMatchesByPUUID } = require('../utils/henrikApi');

router.get('/last/:region/:name/:tag', async (req, res) => {
    const { region, name, tag } = req.params;

    try {
        // Obtener la cuenta para encontrar el PUUID
        const accountData = await getAccount(name, tag);

        if (accountData.status !== 200) {
            return res.status(accountData.status).json(accountData);
        }

        const puuid = accountData.data.puuid;

        const matchesData = await getMatchesByPUUID(region, puuid, 'competitive');

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];

            const stats = lastMatch.players.all_players.find(p => p.puuid === puuid);

            if (req.query.format === 'text') {
                const lang = req.query.lang || 'en';
                const meta = lastMatch.metadata;
                const isWin = lastMatch.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');

                const resultEn = isWin ? 'Win' : 'Loss';
                const resultEs = isWin ? 'Victoria' : 'Derrota';

                const kda = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;

                if (lang === 'es') {
                    return res.send(`Última Partida: ${meta.map} - ${resultEs} (${kda})`);
                } else {
                    return res.send(`Last Match: ${meta.map} - ${resultEn} (${kda})`);
                }
            }

            // Calculate HS%
            const totalShots = (stats.stats.headshots || 0) + (stats.stats.bodyshots || 0) + (stats.stats.legshots || 0);
            const hsPercentage = totalShots > 0 ? ((stats.stats.headshots / totalShots) * 100).toFixed(1) : 0;

            // Agent Info
            const agentName = stats.character;
            const agentIcon = stats.assets.agent.small;

            res.json({
                status: 200,
                data: {
                    ...lastMatch,
                    derived: {
                        hs_percent: hsPercentage,
                        agent_name: agentName,
                        agent_icon: agentIcon
                    }
                }
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
        res.status(error.status || 500).json(error.data || { message: error.message });
    }
});

module.exports = router;
