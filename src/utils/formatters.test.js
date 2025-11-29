const { formatRankData, formatMatchData, formatHistoryData } = require('./formatters');

describe('formatters.js', () => {
    describe('formatRankData', () => {
        it('should format rank data correctly', () => {
            const mockAccount = {
                data: {
                    name: 'Player',
                    tag: '1234',
                    puuid: 'test-puuid',
                    region: 'na',
                    card: { small: 'card-url' }
                }
            };
            const mockMmr = {
                data: {
                    current_data: {
                        currenttierpatched: 'Gold 1',
                        images: { large: 'rank-url' },
                        elo: 1200,
                        mmr_change_to_last_game: 15,
                        ranking_in_tier: 50
                    }
                }
            };

            const result = formatRankData(mockAccount, mockMmr);

            expect(result).toEqual({
                name: 'Player',
                tag: '1234',
                puuid: 'test-puuid',
                region: 'na',
                rank: 'Gold 1',
                rank_image: 'rank-url',
                elo: 1200,
                mmr_change: 15,
                ranking_in_tier: 50,
                card: { small: 'card-url' }
            });
        });
    });

    describe('formatMatchData', () => {
        it('should format match data correctly', () => {
            const mockMatch = {
                metadata: { map: 'Ascent' },
                players: {
                    all_players: [{
                        puuid: 'test-puuid',
                        team: 'Red',
                        character: 'Jett',
                        assets: {
                            agent: { small: 'icon-url', bust: 'bust-url' }
                        },
                        stats: {
                            kills: 20,
                            deaths: 10,
                            assists: 5,
                            headshots: 10,
                            bodyshots: 10,
                            legshots: 0
                        }
                    }]
                },
                teams: {
                    red: { has_won: true }
                }
            };

            const result = formatMatchData(mockMatch, 'test-puuid');

            expect(result.derived.hs_percent).toBe('50.0');
            expect(result.derived.agent_name).toBe('Jett');
            expect(result.derived.map_image).toContain('7eaecc1b-4337-bbf6-6ab9-04b8f06b3319');
        });

        it('should return null if player not found', () => {
            const mockMatch = {
                players: { all_players: [] }
            };
            const result = formatMatchData(mockMatch, 'test-puuid');
            expect(result).toBeNull();
        });
    });

    describe('formatHistoryData', () => {
        it('should format and reverse history data', () => {
            const mockHistory = {
                data: [
                    { date: '2023-01-01', elo: 1000, mmr_change_to_last_game: 10, map: { name: 'Bind' } },
                    { date: '2023-01-02', elo: 1010, mmr_change_to_last_game: 10, map: { name: 'Haven' } }
                ]
            };

            const result = formatHistoryData(mockHistory);

            expect(result).toHaveLength(2);
            expect(result[0].map).toBe('Haven');
            expect(result[1].map).toBe('Bind');
        });
    });
});
