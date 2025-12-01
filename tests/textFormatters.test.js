const { formatRankText, formatMatchText } = require('../src/utils/textFormatters');
const helpers = require('../src/utils/helpers');

// Mock translateRank
helpers.translateRank = jest.fn((rank, lang) => {
    if (lang === 'es' && rank === 'Diamond 1') return 'Diamante 1';
    return rank;
});

describe('textFormatters', () => {
    const rankData = {
        rank: 'Diamond 1',
        ranking_in_tier: 50,
        elo: 1500,
        name: 'Player',
        tag: 'TAG'
    };

    describe('formatRankText', () => {
        it('should format English responses correctly', () => {
            expect(formatRankText(rankData, 'en', '1')).toBe('Currently I am in Diamond 1');
            expect(formatRankText(rankData, 'en', '2')).toBe('Currently I am in Diamond 1 with 50 RR');
            expect(formatRankText(rankData, 'en', '3')).toBe('Currently I am in Diamond 1 with 50 RR, my mmr is 1500');
            expect(formatRankText(rankData, 'en', '4')).toBe('Player#TAG: Diamond 1 - 50 RR');
        });

        it('should format Spanish responses correctly', () => {
            expect(formatRankText(rankData, 'es', '1')).toBe('Actualmente estoy en Diamante 1');
            expect(formatRankText(rankData, 'es', '2')).toBe('Actualmente estoy en Diamante 1 con 50 puntos');
            expect(formatRankText(rankData, 'es', '3')).toBe('Actualmente estoy en Diamante 1 con 50 puntos, mi mmr es de 1500');
        });
    });

    describe('formatMatchText', () => {
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

        it('should format English match responses correctly', () => {
            expect(formatMatchText(matchData, 'en', '1', mmrChange)).toBe('My last match was on Ascent with Jett won 20 RR');
            expect(formatMatchText(matchData, 'en', '2', mmrChange)).toBe('My last match was on Ascent with Jett won 20 RR my kda was 10/5/5');
            expect(formatMatchText(matchData, 'en', '3', mmrChange)).toBe('My last match was on Ascent with Jett won 20 RR my kda was 10/5/5, my HS percentage was 25.5%');
        });

        it('should format Spanish match responses correctly', () => {
            expect(formatMatchText(matchData, 'es', '1', mmrChange)).toBe('Mi última partida fue en Ascent con Jett gané 20 puntos');
            expect(formatMatchText(matchData, 'es', '2', mmrChange)).toBe('Mi última partida fue en Ascent con Jett gané 20 puntos mi kda fue de 10/5/5');
            expect(formatMatchText(matchData, 'es', '3', mmrChange)).toBe('Mi última partida fue en Ascent con Jett gané 20 puntos mi kda fue de 10/5/5, mi porcentaje de HS fue de 25.5% HS');
        });
    });
});
