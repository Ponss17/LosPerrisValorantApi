const axios = require('axios');

const BASE_URL = 'https://api.henrikdev.xyz/valorant';

function getApiKey() {
    const apiKey = process.env.HENRIK_API_KEY;
    if (!apiKey) {
        throw new Error('HENRIK_API_KEY is not configured');
    }
    return apiKey;
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
        if (error.response) {
            throw { status: error.response.status, data: error.response.data };
        } else {
            throw { status: 500, message: 'Internal Server Error', error: error.message };
        }
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
        if (error.response) {
            throw { status: error.response.status, data: error.response.data };
        } else {
            throw { status: 500, message: 'Internal Server Error', error: error.message };
        }
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
        if (error.response) {
            throw { status: error.response.status, data: error.response.data };
        } else {
            throw { status: 500, message: 'Internal Server Error', error: error.message };
        }
    }
}

module.exports = { getAccount, getMMRByPUUID, getMatchesByPUUID };
