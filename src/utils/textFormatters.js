const { translateRank } = require('./helpers');

function formatRankText(rank, rr, elo, user, lang, type) {
    const isEs = lang === 'es';
    const translatedRank = translateRank(rank, lang);

    if (type === '1') return isEs ? `Actualmente estoy en ${translatedRank}` : `Currently I am in ${translatedRank}`;
    if (type === '2') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos` : `Currently I am in ${translatedRank} with ${rr} RR`;
    if (type === '3') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos, mi mmr es de ${elo}` : `Currently I am in ${translatedRank} with ${rr} RR, my mmr is ${elo}`;

    return `${user}: ${translatedRank} - ${rr} RR`;
}

function formatMatchText(map, isWin, kda, hsPercentage, agent, mmrChange, lang, type) {
    const isEs = lang === 'es';

    if (isEs) {
        const resultVerb = isWin ? 'gané' : 'perdí';
        const pointsMsg = `${mmrChange} puntos`;

        if (type === '1') return `Mi última partida fue en ${map} con ${agent} ${resultVerb} ${pointsMsg}`;
        if (type === '2') return `Mi última partida fue en ${map} con ${agent} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}`;
        if (type === '3') return `Mi última partida fue en ${map} con ${agent} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}, mi porcentaje de HS fue de ${hsPercentage}% HS`;

        return `Mi última partida fue en ${map} con ${agent} ${resultVerb} ${pointsMsg} (${kda})`;
    }

    const resultVerb = isWin ? 'won' : 'lost';
    const pointsMsg = `${mmrChange} RR`;

    if (type === '1') return `My last match was on ${map} with ${agent} ${resultVerb} ${pointsMsg}`;
    if (type === '2') return `My last match was on ${map} with ${agent} ${resultVerb} ${pointsMsg} my kda was ${kda}`;
    if (type === '3') return `My last match was on ${map} with ${agent} ${resultVerb} ${pointsMsg} my kda was ${kda}, my HS percentage was ${hsPercentage}%`;

    return `My last match was on ${map} with ${agent} ${resultVerb} ${pointsMsg} (${kda})`;
}

module.exports = { formatRankText, formatMatchText };
