import { fetchPlayerSummary } from './api.js';
import * as UI from './ui.js';

let currentLang = 'es';
let fullSummaryData = null;
let currentConfigMode = 'rank';
const MAX_RECENT_SEARCHES = 3;

console.log('Client JS Loaded');

document.addEventListener('DOMContentLoaded', () => {
    UI.updateLanguageUI(currentLang);
    renderRecentSearches();
});

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLang = btn.dataset.lang;
        UI.updateLanguageUI(currentLang);
        if (fullSummaryData) {
            UI.renderRankCard(fullSummaryData.data.rank, currentLang);
            UI.renderMatchCard(fullSummaryData.data.match, fullSummaryData.data.rank.puuid, currentLang);
            UI.updateCommandsUI(fullSummaryData);
        }
    });
});

document.getElementById('btn-config-rank').addEventListener('click', () => {
    currentConfigMode = 'rank';
    UI.toggleConfigMode('rank');
    UI.updateCommandsUI(fullSummaryData);
});

document.getElementById('btn-config-match').addEventListener('click', () => {
    currentConfigMode = 'match';
    UI.toggleConfigMode('match');
    UI.updateCommandsUI(fullSummaryData);
});

const configInputs = ['bot-platform', 'bot-lang', 'bot-type', 'bot-match-type'];
configInputs.forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
        UI.updateCommandsUI(fullSummaryData);
    });
});

document.getElementById('rank-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const region = document.getElementById('region').value;
    const name = document.getElementById('name').value;
    const tag = document.getElementById('tag').value;

    UI.showLoading(currentLang);

    try {
        const data = await fetchPlayerSummary(region, name, tag);
        fullSummaryData = data;
        saveRecentSearch(region, name, tag);

        UI.renderRankCard(data.data.rank, currentLang);

        if (data.data.match) {
            UI.renderMatchCard(data.data.match, data.data.rank.puuid, currentLang);
        }

        if (data.data.history) {
            UI.renderChart(data.data.history);
        }

        UI.updateCommandsUI(fullSummaryData);
        UI.showResults();

    } catch (error) {
        UI.showError(error, currentLang);
    } finally {
        UI.hideLoading(currentLang);
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
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    UI.renderRecentSearches(searches, (s) => {
        document.getElementById('region').value = s.region;
        document.getElementById('name').value = s.name;
        document.getElementById('tag').value = s.tag;
        document.getElementById('submit-btn').click();
    });
}
