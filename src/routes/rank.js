const express = require('express');
const router = express.Router();
const { getAccount, getMMRByPUUID } = require('../utils/henrikApi');

router.get('/:region/:name/:tag', async (req, res) => {
    const { region, name, tag } = req.params;

    try {
        // Obtener Account para encontrar PUUID
        const accountData = await getAccount(name, tag);

        if (accountData.status !== 200) {
            return res.status(accountData.status).json(accountData);
        }

        const puuid = accountData.data.puuid;

        // Obtener MMR por PUUID
        const mmrData = await getMMRByPUUID(region, puuid);

        if (mmrData.status === 200) {
            const currentData = mmrData.data.current_data;

            if (req.query.format === 'text') {
                const lang = req.query.lang || 'en';
                const type = req.query.type || '1';
                const rank = currentData.currenttierpatched;
                const rr = currentData.ranking_in_tier;
                const elo = currentData.elo;
                const user = `${accountData.data.name}#${accountData.data.tag}`;

                if (lang === 'es') {
                    if (type === '1') return res.send(`Mi rango actual es ${rank}`);
                    if (type === '2') return res.send(`Mi rango actual es ${rank} con ${rr} puntos`);
                    if (type === '3') return res.send(`Mi rango actual es ${rank} con ${rr} puntos (${elo} ELO)`);
                    return res.send(`${user}: ${rank} - ${rr} RR`);
                } else {
                    if (type === '1') return res.send(`Current Rank: ${rank}`);
                    if (type === '2') return res.send(`Current Rank: ${rank} - ${rr} RR`);
                    if (type === '3') return res.send(`Current Rank: ${rank} - ${rr} RR (${elo} ELO)`);
                    return res.send(`${user}: ${rank} - ${rr} RR`);
                }
            }

            res.json({
                status: 200,
                data: {
                    name: accountData.data.name,
                    tag: accountData.data.tag,
                    puuid: puuid,
                    region: region,
                    rank: currentData.currenttierpatched,
                    rank_image: currentData.images.large,
                    elo: currentData.elo,
                    mmr_change: currentData.mmr_change_to_last_game,
                    card: accountData.data.card
                }
            });
        } else {
            if (req.query.format === 'text') {
                return res.send(`Error: ${mmrData.message || 'Could not fetch rank'}`);
            }
            res.status(mmrData.status).json(mmrData);
        }

    } catch (error) {
        res.status(error.status || 500).json(error.data || { message: error.message });
    }
});

module.exports = router;
