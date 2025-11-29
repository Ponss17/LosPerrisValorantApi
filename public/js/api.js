import { apiBase } from './utils.js';

export async function fetchPlayerSummary(region, name, tag) {
    const response = await fetch(`${apiBase}/summary/${region}/${name}/${tag}`);
    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}
