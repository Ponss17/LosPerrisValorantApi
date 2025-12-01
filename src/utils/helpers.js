const { getPUUID } = require('./henrikApi');

function getErrorMsg(status, lang) {
    const isEs = lang === 'es';
    switch (status) {
        case 404: return isEs ? 'Jugador no encontrado' : 'Player not found';
        case 429: return isEs ? 'Demasiadas peticiones' : 'Rate limit exceeded';
        case 500: return isEs ? 'Error del servidor' : 'Server error';
        default: return isEs ? 'Error desconocido' : 'Unknown error';
    }
}

async function getAccountData(name, tag, req, res) {
    const accountData = await getPUUID(name, tag);
    if (accountData.status !== 200) {
        const lang = req.query.lang || 'en';
        if (req.query.format === 'text') {
            return res.send(`Error: ${getErrorMsg(accountData.status, lang)}`);
        }
        res.status(accountData.status).json(accountData);
        return null;
    }
    return accountData;
}

function handleRouteError(req, res, error) {
    console.error('API Error:', error);
    const status = error.status || 500;
    const lang = req.query.lang || 'en';

    if (req.query.format === 'text') {
        return res.send(`Error: ${getErrorMsg(status, lang)}`);
    }
    res.status(status).json(error.data || { message: error.message });
}

const translations = require('../../public/js/translations');

function translateRank(rankName, lang) {
    if (lang !== 'es' || !rankName) return rankName;

    const parts = rankName.split(' ');
    const name = parts[0];
    const tier = parts[1] || '';

    const translatedName = translations.rankNames[name] || name;
    return tier ? `${translatedName} ${tier}` : translatedName;
}

function sendResponse(req, res, data, textFormatter, extraData = null) {
    if (req.query.format === 'text') {
        const lang = req.query.lang || 'en';
        const type = req.query.type || '1';

        if (!textFormatter) {
            return res.status(400).send('Text format not supported for this endpoint');
        }

        return res.send(textFormatter(data, lang, type, extraData));
    }

    res.json({
        status: 200,
        data: data
    });
}

module.exports = { getAccountData, handleRouteError, translateRank, sendResponse };
