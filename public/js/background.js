
document.addEventListener('DOMContentLoaded', () => {
    initDynamicBackground();
});

async function initDynamicBackground() {
    const bgContainer = document.createElement('div');
    bgContainer.id = 'dynamic-bg';
    document.body.prepend(bgContainer);

    const layer1 = createLayer();
    const layer2 = createLayer();
    bgContainer.appendChild(layer1);
    bgContainer.appendChild(layer2);

    let activeLayer = layer1;
    let inactiveLayer = layer2;

    try {
        const maps = await fetchMaps();
        if (maps.length === 0) return;

        changeBackground(activeLayer, maps);
        activeLayer.style.opacity = '1';

        setInterval(() => {
            const nextMap = changeBackground(inactiveLayer, maps);

            inactiveLayer.style.opacity = '1';
            activeLayer.style.opacity = '0';

            const temp = activeLayer;
            activeLayer = inactiveLayer;
            inactiveLayer = temp;

        }, 10000);

    } catch (error) {
        console.error('Failed to initialize dynamic background:', error);
    }
}

function createLayer() {
    const div = document.createElement('div');
    div.classList.add('bg-layer');
    return div;
}

async function fetchMaps() {
    try {
        const response = await fetch('https://valorant-api.com/v1/maps');
        const data = await response.json();
        return data.data.filter(map => map.splash);
    } catch (error) {
        console.error('Error fetching maps:', error);
        return [];
    }
}

function changeBackground(element, maps) {
    const randomMap = maps[Math.floor(Math.random() * maps.length)];
    element.style.backgroundImage = `url('${randomMap.splash}')`;
    return randomMap;
}
