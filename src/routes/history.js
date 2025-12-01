const express = require('express');
const router = express.Router();
const { getMMRHistoryByPUUID } = require('../utils/henrikApi');
const { getAccountData, handleRouteError } = require('../utils/helpers');
const { formatHistoryData } = require('../utils/formatters');

router.get('/:region/:name/:tag', async (req, res) => {
    const { region, name, tag } = req.params;

    try {
        const accountData = await getAccountData(name, tag, req, res);
        if (!accountData) return;

        const puuid = accountData.data.puuid;
        const historyData = await getMMRHistoryByPUUID(region, puuid);

        if (historyData.status === 200) {
            const formattedHistory = formatHistoryData(historyData);

            res.json({
                status: 200,
                data: formattedHistory
            });
        } else {
            res.status(historyData.status).json(historyData);
        }

    } catch (error) {
        handleRouteError(req, res, error);
    }
});

module.exports = router;
