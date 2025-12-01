const { formatRankText, formatMatchText } = require('./textFormatters');
const helpers = require('./helpers');

helpers.translateRank = (rank, lang) => {
    if (lang === 'es' && rank === 'Diamond 1') return 'Diamante 1';
    return rank;
};

console.log('Running tests for textFormatters...');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        passed++;
    } else {
        console.error(`FAIL: ${message}`);
        failed++;
    }
}

const rankData = {
    rank: 'Diamond 1',
    ranking_in_tier: 50,
    elo: 1500,
    name: 'Player',
    tag: 'TAG'
};

assert(formatRankText(rankData, 'en', '1') === 'Currently I am in Diamond 1', 'Rank EN Type 1');
assert(formatRankText(rankData, 'en', '2') === 'Currently I am in Diamond 1 with 50 RR', 'Rank EN Type 2');
assert(formatRankText(rankData, 'en', '3') === 'Currently I am in Diamond 1 with 50 RR, my mmr is 1500', 'Rank EN Type 3');
assert(formatRankText(rankData, 'en', '4') === 'Player#TAG: Diamond 1 - 50 RR', 'Rank EN Default');

assert(formatRankText(rankData, 'es', '1') === 'Actualmente estoy en Diamante 1', 'Rank ES Type 1');
assert(formatRankText(rankData, 'es', '2') === 'Actualmente estoy en Diamante 1 con 50 puntos', 'Rank ES Type 2');
assert(formatRankText(rankData, 'es', '3') === 'Actualmente estoy en Diamante 1 con 50 puntos, mi mmr es de 1500', 'Rank ES Type 3');

const matchData = {
    derived: {
        map_name: 'Ascent',
        is_win: true,
        kda: '10/5/5',
        hs_percent: '25.5',
        agent_name: 'Jett'
    },
    mmr_change: 20
};

const mmrChange = 20;

assert(formatMatchText(matchData, 'en', '1', mmrChange) === 'My last match was on Ascent with Jett won 20 RR', 'Match EN Type 1');
assert(formatMatchText(matchData, 'en', '2', mmrChange) === 'My last match was on Ascent with Jett won 20 RR my kda was 10/5/5', 'Match EN Type 2');
assert(formatMatchText(matchData, 'en', '3', mmrChange) === 'My last match was on Ascent with Jett won 20 RR my kda was 10/5/5, my HS percentage was 25.5%', 'Match EN Type 3');

assert(formatMatchText(matchData, 'es', '1', mmrChange) === 'Mi última partida fue en Ascent con Jett gané 20 puntos', 'Match ES Type 1');
assert(formatMatchText(matchData, 'es', '2', mmrChange) === 'Mi última partida fue en Ascent con Jett gané 20 puntos mi kda fue de 10/5/5', 'Match ES Type 2');
assert(formatMatchText(matchData, 'es', '3', mmrChange) === 'Mi última partida fue en Ascent con Jett gané 20 puntos mi kda fue de 10/5/5, mi porcentaje de HS fue de 25.5% HS', 'Match ES Type 3');

console.log(`\nTests completed. Passed: ${passed}, Failed: ${failed}`);

if (failed > 0) process.exit(1);
