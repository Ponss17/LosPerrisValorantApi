const getBaseUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/valorantapi')) {
        return '/valorantapi';
    }
    return '';
};

const apiBase = getBaseUrl();

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

function formatRankName(rankName, lang) {
    if (lang === 'es') {
        for (const [eng, esp] of Object.entries(translations.rankNames)) {
            if (rankName.includes(eng)) {
                return rankName.replace(eng, esp);
            }
        }
    }
    return rankName;
}

function formatMatchResult(isWin, lang) {
    if (lang === 'es') {
        return isWin ? 'VICTORIA' : 'DERROTA';
    }
    return isWin ? 'WIN' : 'LOSS';
}

function formatMatchResultShort(isWin, lang) {
    if (lang === 'es') {
        return isWin ? 'Victoria' : 'Derrota';
    }
    return isWin ? 'Win' : 'Loss';
}
