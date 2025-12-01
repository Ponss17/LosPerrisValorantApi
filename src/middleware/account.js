const { getAccountData, handleRouteError } = require('../utils/helpers');

async function withAccountData(req, res, next) {
    const { name, tag } = req.params;

    try {
        const accountData = await getAccountData(name, tag, req, res);
        if (!accountData) return;

        req.accountData = accountData;
        req.puuid = accountData.data.puuid;
        next();
    } catch (error) {
        handleRouteError(req, res, error);
    }
}

module.exports = { withAccountData };
