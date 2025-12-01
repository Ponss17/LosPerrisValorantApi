const { translateRank } = require('./helpers');

function formatRankText(rank, rr, elo, user, lang, type) {
    const isEs = lang === 'es';
    const translatedRank = translateRank(rank, lang);

    if (type === '1') return isEs ? `Actualmente estoy en ${translatedRank}` : `${translatedRank}`;
    if (type === '2') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos` : `${translatedRank} - ${rr} RR`;
    if (type === '3') return isEs ? `Actualmente estoy en ${translatedRank} con ${rr} puntos, mi mmr es de ${elo}` : `${translatedRank} - ${rr} RR - ${elo} ELO`;

    return `${user}: ${translatedRank} - ${rr} RR`;
}

function formatMatchText(map, isWin, kda, hsPercentage, agent, mmrChange, lang, type) {
    const isEs = lang === 'es';
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

    if (type === '1') return `${map} - ${result}`;
    if (type === '2') return `${map} - ${result} - ${kda}`;
    if (type === '3') return `${map} - ${result} - ${kda} - ${hsPercentage}% HS`;

    return `${map} - ${result} - ${kda}`;
}

module.exports = { formatRankText, formatMatchText };
