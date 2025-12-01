const { getPUUID } = require('./henrikApi');

async function getAccountData(name, tag, res) {
    const accountData = await getPUUID(name, tag);
    if (accountData.status !== 200) {
        res.status(accountData.status).json(accountData);
        return null;
    }
    return accountData;
}

function handleRouteError(res, error) {
    res.status(error.status || 500).json(error.data || { message: error.message });
}

module.exports = { getAccountData, handleRouteError };
