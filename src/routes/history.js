const express = require('express');
const router = express.Router();
const { getPUUID, getMMRHistoryByPUUID } = require('../utils/henrikApi');

router.get('/:region/:name/:tag', async (req, res) => {
    const { region, name, tag } = req.params;

    try {
        const accountData = await getPUUID(name, tag);

        if (accountData.status !== 200) {
            return res.status(accountData.status).json(accountData);
        }

        const puuid = accountData.data.puuid;
        const historyData = await getMMRHistoryByPUUID(region, puuid);

        if (historyData.status === 200) {
            const formattedHistory = historyData.data.map(match => ({
                date: match.date,
                elo: match.elo,
                change: match.mmr_change_to_last_game,
                map: match.map.name
            })).reverse();

            res.json({
                status: 200,
                data: formattedHistory
            });
        } else {
            res.status(historyData.status).json(historyData);
        }

    } catch (error) {
        res.status(error.status || 500).json(error.data || { message: error.message });
    }
});

module.exports = router;
