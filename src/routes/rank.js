const express = require('express');
const router = express.Router();
const { getMMRByPUUID } = require('../utils/henrikApi');
const { getAccountData, handleRouteError, translateRank } = require('../utils/helpers');
const { formatRankData } = require('../utils/formatters');
const { formatRankText } = require('../utils/textFormatters');

router.get('/:region/:name/:tag', async (req, res) => {
    const { region, name, tag } = req.params;

    try {
        const accountData = await getAccountData(name, tag, req, res);
        if (!accountData) return;

        const puuid = accountData.data.puuid;

        const mmrData = await getMMRByPUUID(region, puuid);

        if (mmrData.status === 200) {
            const currentData = mmrData.data.current_data;

            if (req.query.format === 'text') {
                const lang = req.query.lang || 'en';
                const type = req.query.type || '1';
                const rank = currentData.currenttierpatched;
                const rr = currentData.ranking_in_tier;
                const elo = currentData.elo;
                const user = `${accountData.data.name}#${accountData.data.tag}`;

                return res.send(formatRankText(rank, rr, elo, user, lang, type));
            }

            res.json({
                status: 200,
                data: formatRankData(accountData, mmrData)
            });
        } else {
            if (req.query.format === 'text') {
                return res.send(`Error: ${mmrData.message || 'Could not fetch rank'}`);
            }
            res.status(mmrData.status).json(mmrData);
        }

    } catch (error) {
        handleRouteError(req, res, error);
    }
});

module.exports = router;
