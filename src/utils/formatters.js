function formatRankData(accountData, mmrData) {
    const currentData = mmrData.data.current_data;
    return {
        name: accountData.data.name,
        tag: accountData.data.tag,
        puuid: accountData.data.puuid,
        region: accountData.data.region,
        rank: currentData.currenttierpatched,
        rank_image: currentData.images.large,
        elo: currentData.elo,
        mmr_change: currentData.mmr_change_to_last_game,
        ranking_in_tier: currentData.ranking_in_tier,
        card: accountData.data.card
    };
}

const { MAP_UUIDS } = require('./constants');

function formatMatchData(matchData, puuid) {
    const stats = matchData.players.all_players.find(p => p.puuid === puuid);
    if (!stats) return null;

    const totalShots = (stats.stats.headshots || 0) + (stats.stats.bodyshots || 0) + (stats.stats.legshots || 0);
    const hsPercentage = totalShots > 0 ? ((stats.stats.headshots / totalShots) * 100).toFixed(1) : 0;

    const agentName = stats.character;
    const agentIcon = stats.assets.agent.small;
    const agentImage = stats.assets.agent.bust || stats.assets.agent.full || agentIcon;

    const mapName = matchData.metadata.map;
    const mapUuid = MAP_UUIDS[mapName];
    const mapImage = mapUuid ? `https://media.valorant-api.com/maps/${mapUuid}/splash.png` : null;

    return {
        ...matchData,
        derived: {
            hs_percent: hsPercentage,
            agent_name: agentName,
            agent_icon: agentIcon,
            agent_image: agentImage,
            map_image: mapImage
        }
    };
}

function formatHistoryData(historyData) {
    return historyData.data.map(match => ({
        date: match.date,
        elo: match.elo,
        change: match.mmr_change_to_last_game,
        map: match.map.name
    })).reverse();
}

module.exports = { formatRankData, formatMatchData, formatHistoryData };
