const request = require('supertest');
const app = require('../src/app');
const henrikApi = require('../src/utils/henrikApi');

jest.mock('../src/utils/henrikApi');

describe('Valorant API Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /rank/:region/:name/:tag', () => {
        it('should return rank data for valid player', async () => {
            // Mock responses
            henrikApi.getPUUID.mockResolvedValue({
                status: 200,
                data: { puuid: 'test-puuid', name: 'TestPlayer', tag: 'TAG' }
            });
            henrikApi.getMMRByPUUID.mockResolvedValue({
                status: 200,
                data: {
                    current_data: {
                        currenttierpatched: 'Gold 1',
                        ranking_in_tier: 50,
                        elo: 1250,
                        mmr_change_to_last_game: 15,
                        images: { large: 'https://example.com/rank.png' }
                    }
                }
            });

            const res = await request(app).get('/rank/na/TestPlayer/TAG');

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe(200);
            expect(res.body.data.rank).toBe('Gold 1');
            expect(res.body.data.elo).toBe(1250);
        });

        it('should return 404 if player not found', async () => {
            henrikApi.getPUUID.mockResolvedValue({
                status: 404,
                message: 'Player not found'
            });

            const res = await request(app).get('/rank/na/UnknownPlayer/TAG');

            expect(res.statusCode).toBe(404);
        });

        it('should return 400 for invalid region', async () => {
            const res = await request(app).get('/rank/invalid/TestPlayer/TAG');

            expect(res.statusCode).toBe(400);
            expect(res.body.errors[0].msg).toContain('Invalid region');
        });
    });

    describe('GET /match/last/:region/:name/:tag', () => {
        it('should return last match data', async () => {
            henrikApi.getAccountData = jest.fn();

            henrikApi.getPUUID.mockResolvedValue({
                status: 200,
                data: { puuid: 'test-puuid', name: 'TestPlayer', tag: 'TAG' }
            });

            henrikApi.getMatchesByPUUID.mockResolvedValue({
                status: 200,
                data: [{
                    metadata: { map: 'Ascent', mode: 'Competitive' },
                    teams: { red: { has_won: true }, blue: { has_won: false } },
                    players: {
                        all_players: [{
                            puuid: 'test-puuid',
                            team: 'Red',
                            stats: { kills: 20, deaths: 10, assists: 5 },
                            character: 'Jett',
                            assets: { agent: { small: 'icon.png', bust: 'bust.png' } }
                        }]
                    }
                }]
            });

            henrikApi.getMMRByPUUID.mockResolvedValue({
                status: 200,
                data: { current_data: { mmr_change_to_last_game: 20 } }
            });

            const res = await request(app).get('/match/last/na/TestPlayer/TAG');

            expect(res.statusCode).toBe(200);
            expect(res.body.data.metadata.map).toBe('Ascent');
            expect(res.body.data.derived.kda).toBe('20/10/5');
        });
    });
});
