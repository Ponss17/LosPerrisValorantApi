let mmrChartInstance = null;

function updateLanguageUI(lang) {
    const t = translations[lang];
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

    document.querySelector('.commands-card h3').textContent = t.botCmds;

    const botLang = document.getElementById('bot-lang').value;
    updateBotCommandLabels(botLang);

    document.getElementById('docs-title').textContent = t.docsTitle;
    document.getElementById('docs-desc-rank').textContent = t.docsDescRank;
    document.getElementById('docs-desc-match').textContent = t.docsDescMatch;
    document.getElementById('docs-note').innerHTML = t.docsNote;

    document.getElementById('footer-created').innerHTML = t.footerCreated;
    document.getElementById('footer-other-api').innerHTML = t.footerOtherApi;
    document.getElementById('footer-disclaimer').textContent = t.footerDisclaimer;

    document.querySelectorAll('.example-label').forEach(el => {
        el.textContent = t.exampleLabel;
    });
}

function renderRankCard(data, lang) {
    document.getElementById('player-name').textContent = `${data.name}#${data.tag}`;

    const displayRank = formatRankName(data.rank, lang);
    document.getElementById('rank-text').textContent = displayRank;

    document.getElementById('rank-img').src = data.rank_image;
    document.getElementById('elo').textContent = data.elo;

    const mmrChange = data.mmr_change;
    const mmrEl = document.getElementById('mmr-change');
    mmrEl.textContent = mmrChange > 0 ? `+${mmrChange}` : mmrChange;
    mmrEl.style.color = mmrChange >= 0 ? 'var(--success)' : 'var(--danger)';

    const rr = data.ranking_in_tier || 0;
    document.getElementById('rank-progress').style.width = `${rr}%`;

    if (data.card) {
        if (data.card.wide) {
            document.getElementById('player-card-bg').style.backgroundImage = `url('${data.card.wide}')`;
        }
        if (data.card.small) {
            document.getElementById('player-card-small').src = data.card.small;
        }
    }
}

function renderMatchCard(matchData, playerPuuid, lang) {
    if (!matchData) return;

    const meta = matchData.metadata;
    const stats = matchData.players.all_players.find(p => p.puuid === playerPuuid);
    const isWin = matchData.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');

    document.getElementById('match-map').textContent = meta.map;

    const matchDate = new Date(meta.game_start * 1000);
    const dateOptions = { day: 'numeric', month: 'short' };
    document.getElementById('match-date').textContent = matchDate.toLocaleDateString(lang, dateOptions);

    const resultEl = document.getElementById('match-result');
    resultEl.textContent = formatMatchResult(isWin, lang);
    resultEl.className = `match-result ${isWin ? 'win' : 'loss'}`;

    document.getElementById('match-kda').textContent = `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`;

    if (matchData.derived) {
        document.getElementById('match-hs').textContent = `${matchData.derived.hs_percent}%`;
        document.getElementById('match-agent-icon').src = matchData.derived.agent_icon;

        const bgImage = matchData.derived.map_image || matchData.derived.agent_image;
        if (bgImage) {
            document.querySelector('.match-card').style.setProperty('--match-bg', `url('${bgImage}')`);
        }
    }
}

function renderChart(history) {
    const ctx = document.getElementById('mmrChart').getContext('2d');

    if (mmrChartInstance) {
        mmrChartInstance.destroy();
    }

    const labels = history.map(h => h.map);
    const dataPoints = history.map(h => h.elo);

    const styles = getComputedStyle(document.documentElement);
    const accentColor = styles.getPropertyValue('--accent-color').trim();

    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, hexToRgba(accentColor, 0.5));
    gradient.addColorStop(1, hexToRgba(accentColor, 0));

    mmrChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ELO',
                data: dataPoints,
                borderColor: accentColor,
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: accentColor,
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

function renderRecentSearches(searches, onSearchClick) {
    const container = document.getElementById('recent-searches');

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
        chip.addEventListener('click', () => onSearchClick(s));
        container.appendChild(chip);
    });
}

function updateCommandsUI(fullSummaryData) {
    const botLang = document.getElementById('bot-lang').value;
    updateBotCommandLabels(botLang);

    if (!fullSummaryData) return;

    const region = document.getElementById('region').value;
    const name = document.getElementById('name').value;
    const tag = document.getElementById('tag').value;

    const botPlatform = document.getElementById('bot-platform').value;
    const botType = document.getElementById('bot-type').value;
    const botMatchType = document.getElementById('bot-match-type').value;

    const baseUrl = window.location.origin + apiBase;

    const rankUrl = `${baseUrl}/rank/${region}/${name}/${tag}?format=text&lang=${botLang}&type=${botType}`;
    const matchUrl = `${baseUrl}/match/last/${region}/${name}/${tag}?format=text&lang=${botLang}&type=${botMatchType}`;

    document.getElementById('cmd-rank').value = getCommandSyntax(botPlatform, rankUrl);
    document.getElementById('cmd-match').value = getCommandSyntax(botPlatform, matchUrl);

    updateExamplePreviews(fullSummaryData, botLang, botType, botMatchType);
    updateBotCommandLabels(botLang);
}

function updateBotCommandLabels(botLang) {
    const t = translations[botLang];
    if (t) {
        document.getElementById('lbl-cmd-rank').textContent = t.cmdRank;
        document.getElementById('lbl-cmd-match').textContent = t.cmdMatch;

        document.querySelectorAll('.example-label').forEach(el => {
            el.textContent = t.exampleLabel;
        });
    }
}

async function updateExamplePreviews(data, botLang, botType, botMatchType) {
    const r = data.data.rank;
    const m = data.data.match;

    try {
        const response = await fetch(`${apiBase}/preview`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'rank',
                lang: botLang,
                botType: botType,
                data: {
                    rank: r.rank,
                    rr: r.ranking_in_tier,
                    elo: r.elo,
                    name: r.name,
                    tag: r.tag
                }
            })
        });
        const result = await response.json();
        document.getElementById('example-rank').textContent = result.text;
    } catch (e) {
        console.error('Preview Error (Rank):', e);
    }

    if (m) {
        try {
            const stats = m.players.all_players.find(p => p.puuid === r.puuid);
            const isWin = m.teams.red.has_won ? (stats.team === 'Red') : (stats.team === 'Blue');

            const response = await fetch(`${apiBase}/preview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'match',
                    lang: botLang,
                    botMatchType: botMatchType,
                    data: {
                        map: m.metadata.map,
                        isWin: isWin,
                        kda: `${stats.stats.kills}/${stats.stats.deaths}/${stats.stats.assists}`,
                        hs: m.derived.hs_percent,
                        agent: m.derived.agent_name,
                        mmrChange: r.mmr_change
                    }
                })
            });
            const result = await response.json();
            document.getElementById('example-match').textContent = result.text;
        } catch (e) {
            console.error('Preview Error (Match):', e);
        }
    }
}

function showLoading(lang) {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = lang === 'es' ? 'Buscando jugador...' : 'Searching...';
}

function hideLoading(lang) {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = false;
    submitBtn.textContent = translations[lang].search;
}

function showResults() {
    const resultContainer = document.getElementById('result');
    resultContainer.classList.remove('hidden');
    resultContainer.classList.remove('fade-in');
    void resultContainer.offsetWidth;
    resultContainer.classList.add('fade-in');
    document.getElementById('error').classList.add('hidden');
}

function showError(error, lang) {
    document.getElementById('result').classList.add('hidden');
    const errorDiv = document.getElementById('error');
    errorDiv.classList.remove('hidden');

    const t = translations[lang];
    let msg = t.error;

    if (error.error) {
        if (error.error === 'USER_NOT_FOUND') msg = t.errorUserNotFound;
        else if (error.error === 'RATE_LIMIT') msg = t.errorRateLimit;
        else if (error.error === 'SERVER_ERROR') msg = t.errorServer;
    }

    document.getElementById('error-msg').textContent = msg;
}

function toggleConfigMode(mode) {
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
}
