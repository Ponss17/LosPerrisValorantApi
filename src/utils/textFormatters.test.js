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

const rank = 'Diamond 1';
const rr = 50;
const elo = 1500;
const user = 'Player#TAG';

assert(formatRankText(rank, rr, elo, user, 'en', '1') === 'Diamond 1', 'Rank EN Type 1');
assert(formatRankText(rank, rr, elo, user, 'en', '2') === 'Diamond 1 - 50 RR', 'Rank EN Type 2');
assert(formatRankText(rank, rr, elo, user, 'en', '3') === 'Diamond 1 - 50 RR - 1500 ELO', 'Rank EN Type 3');
assert(formatRankText(rank, rr, elo, user, 'en', '4') === 'Player#TAG: Diamond 1 - 50 RR', 'Rank EN Default');

assert(formatRankText(rank, rr, elo, user, 'es', '1') === 'Actualmente estoy en Diamante 1', 'Rank ES Type 1');
assert(formatRankText(rank, rr, elo, user, 'es', '2') === 'Actualmente estoy en Diamante 1 con 50 puntos', 'Rank ES Type 2');
assert(formatRankText(rank, rr, elo, user, 'es', '3') === 'Actualmente estoy en Diamante 1 con 50 puntos, mi mmr es de 1500', 'Rank ES Type 3');

const map = 'Ascent';
const isWin = true;
const kda = '10/5/5';
const hs = '25.5';
const agent = 'Jett';
const mmrChange = 20;

assert(formatMatchText(map, isWin, kda, hs, agent, mmrChange, 'en', '1') === 'Ascent - Win', 'Match EN Type 1');
assert(formatMatchText(map, isWin, kda, hs, agent, mmrChange, 'en', '2') === 'Ascent - Win - 10/5/5', 'Match EN Type 2');
assert(formatMatchText(map, isWin, kda, hs, agent, mmrChange, 'en', '3') === 'Ascent - Win - 10/5/5 - 25.5% HS', 'Match EN Type 3');

assert(formatMatchText(map, isWin, kda, hs, agent, mmrChange, 'es', '1') === 'Mi última partida fue en Ascent con Jett gané 20 puntos', 'Match ES Type 1');
assert(formatMatchText(map, isWin, kda, hs, agent, mmrChange, 'es', '2') === 'Mi última partida fue en Ascent con Jett gané 20 puntos mi kda fue de 10/5/5', 'Match ES Type 2');
assert(formatMatchText(map, isWin, kda, hs, agent, mmrChange, 'es', '3') === 'Mi última partida fue en Ascent con Jett gané 20 puntos mi kda fue de 10/5/5, mi porcentaje de HS fue de 25.5% HS', 'Match ES Type 3');

console.log(`\nTests completed. Passed: ${passed}, Failed: ${failed}`);

if (failed > 0) process.exit(1);
