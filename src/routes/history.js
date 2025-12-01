const express = require('express');
const router = express.Router();
const { getMMRHistoryByPUUID } = require('../utils/henrikApi');
const { handleRouteError } = require('../utils/helpers');
const { formatHistoryData } = require('../utils/formatters');

const { commonValidations } = require('../middleware/validators');

const { withAccountData } = require('../middleware/account');

router.get('/:region/:name/:tag', commonValidations, withAccountData, async (req, res) => {
    const { region } = req.params;
    const { puuid } = req;

    try {
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
