
let currentLang = 'es';
let currentData = null;
let currentConfigMode = 'rank';

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

document.getElementById('btn-config-rank').addEventListener('click', () => {
    setConfigMode('rank');
});

document.getElementById('btn-config-match').addEventListener('click', () => {
    setConfigMode('match');
});

function setConfigMode(mode) {
    currentConfigMode = mode;

    document.getElementById('btn-config-rank').classList.toggle('active', mode === 'rank');
    document.getElementById('btn-config-match').classList.toggle('active', mode === 'match');

    const rankGroup = document.getElementById('group-rank-format');
    const matchGroup = document.getElementById('group-match-format');

    if (mode === 'rank') {
        rankGroup.classList.remove('hidden');
        matchGroup.classList.add('hidden');
    } else {
        rankGroup.classList.add('hidden');
        matchGroup.classList.remove('hidden');
    }

    updateCommands();
}

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

    const chartTitle = document.getElementById('chart-title');
    if (chartTitle) chartTitle.textContent = t.chartTitle;

    document.querySelector('.config-card h3').textContent = t.botConfig;
    document.querySelector('label[for="bot-platform"]').textContent = t.botPlatform;
    document.querySelector('label[for="bot-lang"]').textContent = t.botLang;

    document.querySelector('label[for="bot-type"]').textContent = t.rankFormat;
    const typeSelect = document.getElementById('bot-type');
    typeSelect.options[0].text = t.format1;
    typeSelect.options[1].text = t.format2;
    typeSelect.options[2].text = t.format3;

    document.querySelector('label[for="bot-match-type"]').textContent = t.matchFormat;
    const matchTypeSelect = document.getElementById('bot-match-type');
    matchTypeSelect.options[0].text = t.matchType1;
    matchTypeSelect.options[1].text = t.matchType2;
    matchTypeSelect.options[2].text = t.matchType3;

    document.getElementById('btn-config-rank').textContent = t.rankConfig;
    document.getElementById('btn-config-match').textContent = t.matchConfig;

    document.getElementById('btn-config-match').textContent = t.matchConfig;

    document.getElementById('btn-config-match').textContent = t.matchConfig;

    document.querySelector('.commands-card h3').textContent = t.botCmds;
    document.getElementById('lbl-cmd-rank').textContent = t.cmdRank;
    document.getElementById('lbl-cmd-match').textContent = t.cmdMatch;

    document.getElementById('docs-title').textContent = t.docsTitle;
    document.getElementById('docs-desc-rank').textContent = t.docsDescRank;
    document.getElementById('docs-desc-match').textContent = t.docsDescMatch;
    document.getElementById('docs-note').innerHTML = t.docsNote;

    document.getElementById('footer-created').innerHTML = t.footerCreated;
    document.getElementById('footer-other-api').innerHTML = t.footerOtherApi;
    document.getElementById('footer-disclaimer').textContent = t.footerDisclaimer;

    if (currentData && currentData.rank) {
        let displayRank = currentData.rank;
        if (currentLang === 'es') {
            for (const [eng, esp] of Object.entries(translations.rankNames)) {
                if (displayRank.includes(eng)) {
                    displayRank = displayRank.replace(eng, esp);
                    break;
                }
            }
        }
        document.getElementById('rank-text').textContent = displayRank;
    }
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
    const botMatchType = document.getElementById('bot-match-type').value;

    const baseUrl = window.location.origin + apiBase;

    const rankUrl = `${baseUrl}/rank/${region}/${name}/${tag}?format=text&lang=${botLang}&type=${botType}`;
    const matchUrl = `${baseUrl}/match/last/${region}/${name}/${tag}?format=text&lang=${botLang}&type=${botMatchType}`;

    document.getElementById('cmd-rank').value = getCommandSyntax(botPlatform, rankUrl);
    document.getElementById('cmd-match').value = getCommandSyntax(botPlatform, matchUrl);
}

document.getElementById('bot-platform').addEventListener('change', updateCommands);
document.getElementById('bot-lang').addEventListener('change', updateCommands);
document.getElementById('bot-type').addEventListener('change', updateCommands);
document.getElementById('bot-match-type').addEventListener('change', updateCommands);

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
        const summaryRes = await fetch(`${apiBase}/summary/${region}/${name}/${tag}`);
        const summaryData = await summaryRes.json();
        fullSummaryData = summaryData;

        if (summaryRes.ok) {
            saveRecentSearch(region, name, tag);
            const d = summaryData.data.rank;
            currentData = d;

            document.getElementById('player-name').textContent = `${d.name}#${d.tag}`;

            let displayRank = d.rank;
            if (currentLang === 'es') {
                for (const [eng, esp] of Object.entries(translations.rankNames)) {
                    if (displayRank.includes(eng)) {
                        displayRank = displayRank.replace(eng, esp);
                        break;
                    }
                }
            }
            document.getElementById('rank-text').textContent = displayRank;

            document.getElementById('rank-img').src = d.rank_image;
            document.getElementById('elo').textContent = d.elo;

            const mmrChange = d.mmr_change;
            const mmrEl = document.getElementById('mmr-change');
            mmrEl.textContent = mmrChange > 0 ? `+${mmrChange}` : mmrChange;
            mmrEl.style.color = mmrChange >= 0 ? 'var(--success)' : 'var(--danger)';

            const rr = d.ranking_in_tier || 0;
            document.getElementById('rank-progress').style.width = `${rr}%`;

            if (d.card) {
                if (d.card.wide) {
                    document.getElementById('player-card-bg').style.backgroundImage = `url('${d.card.wide}')`;
                }
                if (d.card.small) {
                    document.getElementById('player-card-small').src = d.card.small;
                }
            }

            if (summaryData.data.match) {
                const m = summaryData.data.match;
                const meta = m.metadata;
                const stats = m.players.all_players.find(p => p.puuid === d.puuid);
                const isWin = m.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');

                document.getElementById('match-map').textContent = meta.map;

                const matchDate = new Date(meta.game_start * 1000);
                const dateOptions = { day: 'numeric', month: 'short' };
                document.getElementById('match-date').textContent = matchDate.toLocaleDateString(currentLang, dateOptions);

                const resultEl = document.getElementById('match-result');
                resultEl.textContent = isWin ? 'VICTORIA' : 'DERROTA';
                resultEl.className = `match-result ${isWin ? 'win' : 'loss'}`;

                document.getElementById('match-kda').textContent = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;

                if (m.derived) {
                    document.getElementById('match-hs').textContent = `${m.derived.hs_percent}%`;
                    document.getElementById('match-agent-icon').src = m.derived.agent_icon;

                    if (m.derived.agent_image) {
                        document.querySelector('.match-card').style.setProperty('--match-bg', `url('${m.derived.agent_image}')`);
                    }
                }
            }

            if (summaryData.data.history) {
                renderChart(summaryData.data.history);
            }


            updateCommands();

            const resultContainer = document.getElementById('result');
            resultContainer.classList.remove('hidden');
            resultContainer.classList.remove('fade-in');
            void resultContainer.offsetWidth;
            resultContainer.classList.add('fade-in');

            document.getElementById('error').classList.add('hidden');
        } else {
            throw summaryData;
        }
    } catch (error) {
        document.getElementById('result').classList.add('hidden');
        const errorDiv = document.getElementById('error');
        errorDiv.classList.remove('hidden');

        const t = translations[currentLang];
        let msg = t.error;

        if (error.error) {
            if (error.error === 'USER_NOT_FOUND') msg = t.errorUserNotFound;
            else if (error.error === 'RATE_LIMIT') msg = t.errorRateLimit;
            else if (error.error === 'SERVER_ERROR') msg = t.errorServer;
        }

        document.getElementById('error-msg').textContent = msg;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = translations[currentLang].search;
    }
});

let mmrChartInstance = null;

function renderChart(history) {
    const ctx = document.getElementById('mmrChart').getContext('2d');

    if (mmrChartInstance) {
        mmrChartInstance.destroy();
    }

    const labels = history.map(h => h.map);
    const dataPoints = history.map(h => h.elo);

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 70, 85, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 70, 85, 0)');

    mmrChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ELO',
                data: dataPoints,
                borderColor: '#ff4655',
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#ff4655',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b9bb4',
                        font: {
                            family: 'Roboto'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b9bb4',
                        font: {
                            family: 'Roboto'
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

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

const MAX_RECENT_SEARCHES = 3;

function saveRecentSearch(region, name, tag) {
    let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    searches = searches.filter(s => !(s.name.toLowerCase() === name.toLowerCase() && s.tag.toLowerCase() === tag.toLowerCase()));

    searches.unshift({ region, name, tag });

    if (searches.length > MAX_RECENT_SEARCHES) {
        searches.pop();
    }

    localStorage.setItem('recentSearches', JSON.stringify(searches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const container = document.getElementById('recent-searches');
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    if (searches.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.innerHTML = '';
    container.classList.remove('hidden');

    searches.forEach(s => {
        const chip = document.createElement('div');
        chip.className = 'search-chip';
        chip.innerHTML = `<span>${s.name}#${s.tag}</span>`;
        chip.addEventListener('click', () => {
            document.getElementById('region').value = s.region;
            document.getElementById('name').value = s.name;
            document.getElementById('tag').value = s.tag;
            document.getElementById('submit-btn').click();
        });
        container.appendChild(chip);
    });
}

document.getElementById('btn-copy-json').addEventListener('click', () => {
    if (!fullSummaryData) return;

    const jsonStr = JSON.stringify(fullSummaryData, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
        const btn = document.getElementById('btn-copy-json');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => btn.innerHTML = originalHtml, 2000);
    });
});

let fullSummaryData = null;

renderRecentSearches();
