const { translateRank } = require('./helpers');

function formatRankText(rank, rr, elo, user, lang, type) {
    const isEs = lang === 'es';
    const translatedRank = translateRank(rank, lang);

    if (type === '1') return isEs ? `Actualmente estoy en ${translatedRank}` : `Current Rank: ${translatedRank}`;
    if (type === '2') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos` : `Current Rank: ${translatedRank} - ${rr} RR`;
    if (type === '3') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos, mi mmr es de ${elo}` : `Current Rank: ${translatedRank} - ${rr} RR (${elo} ELO)`;

    return `${user}: ${translatedRank} - ${rr} RR`;
}

function formatMatchText(map, isWin, kda, hsPercentage, agent, mmrChange, lang, type) {
    const isEs = lang === 'es';
    const prefix = isEs ? 'Última Partida' : 'Last Match';
    const result = isEs
        ? (isWin ? 'Victoria' : 'Derrota')
        : (isWin ? 'Win' : 'Loss');

    if (isEs) {
        const resultVerb = isWin ? 'gané' : 'perdí';
        const pointsMsg = `${mmrChange} puntos`;

        if (type === '1') return `Mi última partida fue en ${map} con ${agent} ${resultVerb} ${pointsMsg}`;
        if (type === '2') return `Mi última partida fue en ${map} con ${agent} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}`;
        if (type === '3') return `Mi última partida fue en ${map} con ${agent} ${resultVerb} ${pointsMsg} mi kda fue de ${kda}, mi porcentaje de HS fue de ${hsPercentage}% HS`;

        return `Mi última partida fue en ${map} con ${agent} ${resultVerb} ${pointsMsg} (${kda})`;
    }

    if (type === '1') return `${prefix}: ${map} - ${result}`;
    if (type === '2') return `${prefix}: ${map} - ${result} (${kda})`;
    if (type === '3') return `${prefix}: ${map} - ${result} (${kda} - ${hsPercentage}% HS)`;

    return `${prefix}: ${map} - ${result} (${kda})`;
}

module.exports = { formatRankText, formatMatchText };
