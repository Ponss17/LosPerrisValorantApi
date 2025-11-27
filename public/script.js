const translations = {
    en: {
        title: 'LOSPERRIS <span class="accent">VALORANT API</span>',
        subtitle: 'Rank, History & Commands for Streamers',
        region: 'Region',
        riotId: 'Riot ID',
        tag: 'Tag',
        search: 'SEARCH',
        lastMatch: 'Last Match',
        error: 'Player not found',
        botConfig: 'Bot Configuration',
        botPlatform: 'Platform',
        botLang: 'Bot Language',
        rankFormat: 'Rank Format',
        botCmds: 'Bot Commands',
        format1: 'Rank Only',
        format2: 'Rank + RR',
        format3: 'Rank + RR + ELO'
    },
    es: {
        title: 'LOSPERRIS <span class="accent">VALORANT API</span>',
        subtitle: 'Rango, Historial y Comandos para Streamers',
        region: 'Región',
        riotId: 'Riot ID',
        tag: 'Tag',
        search: 'BUSCAR',
        lastMatch: 'Última Partida',
        error: 'Jugador no encontrado',
        botConfig: 'Configuración del Bot',
        botPlatform: 'Plataforma',
        botLang: 'Idioma del Bot',
        rankFormat: 'Formato de Rango',
        botCmds: 'Comandos del Bot',
        format1: 'Solo Rango',
        format2: 'Rango + Puntos',
        format3: 'Rango + Puntos + ELO'
    }
};

let currentLang = 'es';
let currentData = null;

// Determine base URL for API requests
const getBaseUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/valorantapi')) {
        return '/valorantapi';
    }
    return '';
};
const apiBase = getBaseUrl();

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLang = btn.dataset.lang;
        updateLanguage();
    });
});

function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('title').innerHTML = t.title;
    document.getElementById('subtitle').textContent = t.subtitle;
    document.querySelector('label[for="region"]').textContent = t.region;
    document.querySelector('label[for="name"]').textContent = t.riotId;
    document.querySelector('label[for="tag"]').textContent = t.tag;
    document.getElementById('submit-btn').textContent = t.search;
    document.getElementById('last-match-title').textContent = t.lastMatch;
    document.getElementById('error-msg').textContent = t.error;

    document.querySelector('.config-card h3').textContent = t.botConfig;
    document.querySelector('label[for="bot-platform"]').textContent = t.botPlatform;
    document.querySelector('label[for="bot-lang"]').textContent = t.botLang;
    document.querySelector('label[for="bot-type"]').textContent = t.rankFormat;
    const typeSelect = document.getElementById('bot-type');
    typeSelect.options[0].text = t.format1;
    typeSelect.options[1].text = t.format2;
    typeSelect.options[2].text = t.format3;

    document.querySelector('.commands-card h3').textContent = t.botCmds;
}

function getCommandSyntax(platform, url) {
    switch (platform) {
        case 'nightbot':
            return `$(urlfetch ${url})`;
        case 'streamelements':
            return `\${customapi.${url}}`;
        case 'fossabot':
            return `$(customapi ${url})`;
        case 'streamlabs':
            return `{readapi.${url}}`;
        default:
            return url;
    }
}

function updateCommands() {
    if (!currentData) return;

    const region = document.getElementById('region').value;
    const name = document.getElementById('name').value;
    const tag = document.getElementById('tag').value;

    const botPlatform = document.getElementById('bot-platform').value;
    const botLang = document.getElementById('bot-lang').value;
    const botType = document.getElementById('bot-type').value;

    const baseUrl = window.location.origin + apiBase;

    const rankUrl = `${baseUrl}/rank/${region}/${name}/${tag}?format=text&lang=${botLang}&type=${botType}`;
    const matchUrl = `${baseUrl}/match/last/${region}/${name}/${tag}?format=text&lang=${botLang}`;

    document.getElementById('cmd-rank').value = getCommandSyntax(botPlatform, rankUrl);
    document.getElementById('cmd-match').value = getCommandSyntax(botPlatform, matchUrl);
}

document.getElementById('bot-platform').addEventListener('change', updateCommands);
document.getElementById('bot-lang').addEventListener('change', updateCommands);
document.getElementById('bot-type').addEventListener('change', updateCommands);

document.getElementById('rank-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const region = document.getElementById('region').value;
    const name = document.getElementById('name').value;
    const tag = document.getElementById('tag').value;
    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'es' ? 'Buscando jugador...' : 'Searching...';

    try {
        const rankRes = await fetch(`${apiBase}/rank/${region}/${name}/${tag}`);
        const rankData = await rankRes.json();

        if (rankRes.ok) {
            const d = rankData.data;
            currentData = d;

            document.getElementById('player-name').textContent = `${d.name}#${d.tag}`;
            document.getElementById('rank-text').textContent = d.rank;
            document.getElementById('rank-img').src = d.rank_image;
            document.getElementById('elo').textContent = d.elo;

            const mmrChange = d.mmr_change;
            const mmrEl = document.getElementById('mmr-change');
            mmrEl.textContent = mmrChange > 0 ? `+${mmrChange}` : mmrChange;
            mmrEl.style.color = mmrChange >= 0 ? 'var(--success)' : 'var(--danger)';

            if (d.card) {
                if (d.card.wide) {
                    document.getElementById('player-card-bg').style.backgroundImage = `url('${d.card.wide}')`;
                }
                if (d.card.small) {
                    document.getElementById('player-card-small').src = d.card.small;
                }
            }

            const matchRes = await fetch(`${apiBase}/match/last/${region}/${name}/${tag}`);
            const matchData = await matchRes.json();

            if (matchRes.ok) {
                const m = matchData.data;
                const meta = m.metadata;
                const stats = m.players.all_players.find(p => p.puuid === d.puuid);
                const isWin = m.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');

                document.getElementById('match-map').textContent = meta.map;
                const resultEl = document.getElementById('match-result');
                resultEl.textContent = isWin ? 'VICTORIA' : 'DERROTA';
                resultEl.className = `match-result ${isWin ? 'win' : 'loss'}`;

                document.getElementById('match-kda').textContent = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;
            }

            updateCommands();

            document.getElementById('result').classList.remove('hidden');
            document.getElementById('error').classList.add('hidden');
        } else {
            throw new Error('Player not found');
        }
    } catch (error) {
        document.getElementById('result').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = translations[currentLang].search;
    }
});

document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        input.select();
        document.execCommand('copy');

        const originalText = btn.textContent;
        btn.textContent = 'COPIED!';
        setTimeout(() => btn.textContent = originalText, 2000);
    });
});
