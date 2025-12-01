const { translateRank } = require('./helpers');

function formatRankText(data, lang, type) {
    const { rank, ranking_in_tier, elo, name, tag } = data;
    const user = `${name}#${tag}`;
    const rr = ranking_in_tier;

    const isEs = lang === 'es';
    const translatedRank = translateRank(rank, lang);

    if (type === '1') return isEs ? `Actualmente estoy en ${translatedRank}` : `Currently I am in ${translatedRank}`;
    if (type === '2') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos` : `Currently I am in ${translatedRank} with ${rr} RR`;
    if (type === '3') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos, mi mmr es de ${elo}` : `Currently I am in ${translatedRank} with ${rr} RR, my mmr is ${elo}`;

    return `${user}: ${translatedRank} - ${rr} RR`;
}

function formatMatchText(data, lang, type, mmrChange) {
    const { derived } = data;
    const { map_name, is_win, kda, hs_percent, agent_name } = derived;

    const change = mmrChange !== undefined ? mmrChange : (data.mmr_change || 0);

    const isEs = lang === 'es';

    if (isEs) {
        const resultVerb = is_win ? 'gané' : 'perdí';
        const pointsMsg = `${change} puntos`;

        if (type === '1') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg}`;
        if (type === '2') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}`;
        if (type === '3') return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}, mi porcentaje de HS fue de ${hs_percent}% HS`;

        return `Mi última partida fue en ${map_name} con ${agent_name} ${resultVerb} ${pointsMsg} (${kda})`;
    }

    const resultVerb = is_win ? 'won' : 'lost';
    const pointsMsg = `${change} RR`;

    if (type === '1') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg}`;
    if (type === '2') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} my kda was ${kda}`;
    if (type === '3') return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} my kda was ${kda}, my HS percentage was ${hs_percent}%`;

    return `My last match was on ${map_name} with ${agent_name} ${resultVerb} ${pointsMsg} (${kda})`;
}

module.exports = { formatRankText, formatMatchText };
