const express = require('express');
const router = express.Router();
const { getMatchesByPUUID, getMMRByPUUID } = require('../utils/henrikApi');
const { handleRouteError, sendResponse } = require('../utils/helpers');
const { formatMatchData } = require('../utils/formatters');
const { formatMatchText } = require('../utils/textFormatters');

const { commonValidations } = require('../middleware/validators');

const { withAccountData } = require('../middleware/account');

router.get('/last/:region/:name/:tag', commonValidations, withAccountData, async (req, res) => {
    const { region } = req.params;
    const { accountData, puuid } = req;

    try {
        const [matchesData, mmrData] = await Promise.all([
            getMatchesByPUUID(region, puuid, 'competitive'),
            getMMRByPUUID(region, puuid)
        ]);

        if (matchesData.status === 200 && matchesData.data.length > 0) {
            const lastMatch = matchesData.data[0];
            const formattedData = formatMatchData(lastMatch, puuid);

            const mmrChange = (mmrData.status === 200) ? mmrData.data.current_data.mmr_change_to_last_game : 0;

            sendResponse(req, res, formattedData, formatMatchText, mmrChange);
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
