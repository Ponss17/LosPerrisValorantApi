const express = require('express');
const router = express.Router();
const { getMMRByPUUID } = require('../utils/henrikApi');
const { getAccountData, handleRouteError, translateRank, sendResponse } = require('../utils/helpers');
const { formatRankData } = require('../utils/formatters');
const { formatRankText } = require('../utils/textFormatters');

const { commonValidations } = require('../middleware/validators');

router.get('/:region/:name/:tag', commonValidations, async (req, res) => {
    const { region, name, tag } = req.params;

    try {
        const accountData = await getAccountData(name, tag, req, res);
        if (!accountData) return;

        const puuid = accountData.data.puuid;

        const mmrData = await getMMRByPUUID(region, puuid);

        if (mmrData.status === 200) {
            const formattedData = formatRankData(accountData, mmrData);
            sendResponse(req, res, formattedData, formatRankText);
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
