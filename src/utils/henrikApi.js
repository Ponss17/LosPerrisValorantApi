const axios = require('axios');

const BASE_URL = 'https://api.henrikdev.xyz/valorant';

function getApiKey() {
    const apiKey = process.env.HENRIK_API_KEY;
    if (!apiKey) {
        throw new Error('HENRIK_API_KEY is not configured');
    }
    return apiKey;
}

function handleApiError(error) {
    if (error.response) {
        throw { status: error.response.status, data: error.response.data };
    } else {
        throw { status: 500, message: 'Internal Server Error', error: error.message };
    }
}

async function getAccount(name, tag) {
    try {
        const response = await axios.get(`${BASE_URL}/v1/account/${name}/${tag}`, {
            headers: {
                'Authorization': getApiKey(),
                'accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

async function getMMRByPUUID(region, puuid) {
    try {
        const response = await axios.get(`${BASE_URL}/v2/by-puuid/mmr/${region}/${puuid}`, {
            headers: {
                'Authorization': getApiKey(),
                'accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

async function getMatchesByPUUID(region, puuid, mode = 'competitive') {
    try {
        const response = await axios.get(`${BASE_URL}/v3/by-puuid/matches/${region}/${puuid}?mode=${mode}`, {
            headers: {
                'Authorization': getApiKey(),
                'accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

const cache = require('./cache');

async function getMMRHistoryByPUUID(region, puuid) {
    try {
        const response = await axios.get(`${BASE_URL}/v1/by-puuid/mmr-history/${region}/${puuid}`, {
            headers: {
                'Authorization': getApiKey(),
                'accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

async function getPUUID(name, tag) {
    const cacheKey = `puuid:${name.toLowerCase()}:${tag.toLowerCase()}`;
    const cachedPUUID = cache.get(cacheKey);

    if (cachedPUUID) {
        return { status: 200, data: { puuid: cachedPUUID, name, tag } };
    }

    try {
        const accountData = await getAccount(name, tag);
        if (accountData.status === 200) {
            cache.set(cacheKey, accountData.data.puuid);
            return accountData;
        }
        return accountData;
    } catch (error) {
        throw error;
    }
}

module.exports = { getAccount, getMMRByPUUID, getMatchesByPUUID, getPUUID, getMMRHistoryByPUUID };
