# LosPerris Valorant Api

API de Valorant diseñada para streamers, con soporte nativo para Nightbot y un Hub Visual moderno para generar comandos fácilmente.

![Preview](public/imgs/LosPerris-gamer.ico)

## Características

-   **Rango Actual**: Obtén tu rango, ELO y RR actual.
-   **Última Partida**: Detalles de tu última partida competitiva (Mapa, Resultado, KDA).
-   **Soporte Nightbot**: Respuestas en texto plano optimizadas para comandos de chat (`!rank`, `!lastmatch`).
-   **Personalización Avanzada**:
    -   **Idiomas**: Español (`es`) e Inglés (`en`).
    -   **Formatos**: Elige qué información mostrar (Solo Rango, +RR, +ELO).
-   **Hub Visual**: Interfaz web limpia y oscura (estilo Valorant) para buscar jugadores y generar tus comandos.

## Instalación Local

1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz y agrega tu API Key de HenrikDev (Obténla en [HenrikDev API](https://docs.henrikdev.xyz/)):
    ```env
    HENRIK_API_KEY=tu_api_key_aqui
    ```
4.  Inicia el servidor:
    ```bash
    npm run dev
    ```
5.  Abre `http://localhost:3000` en tu navegador.

## Despliegue en Vercel

Este proyecto está optimizado para Vercel.

1.  Sube tu código a GitHub.
2.  Importa el proyecto en Vercel.
3.  En la configuración del proyecto en Vercel, ve a **Settings > Environment Variables** y agrega:
    -   Key: `HENRIK_API_KEY`
    -   Value: `tu_api_key_real`
4.  ¡Despliega!

## Documentación de la API

### 1. Obtener Rango
`GET /rank/:region/:name/:tag`

**Parámetros Query (Opcionales):**
-   `format`: `text` (Para respuesta en texto plano, ideal para bots).
-   `lang`: `es` (Español) | `en` (Inglés - Default).
-   `type`:
    -   `1`: Solo Rango (ej. "Gold 1")
    -   `2`: Rango + RR (ej. "Gold 1 - 50 RR")
    -   `3`: Rango + RR + ELO (ej. "Gold 1 - 50 RR (1200 ELO)")

**Ejemplo Nightbot:**
```
$(urlfetch https://tu-dominio.vercel.app/rank/na/PonssLoveless/8882?format=text&lang=es&type=2)
```

### 2. Obtener Última Partida
`GET /match/last/:region/:name/:tag`

**Parámetros Query (Opcionales):**
-   `format`: `text`
-   `lang`: `es` | `en`

**Ejemplo Nightbot:**
```
$(urlfetch https://tu-dominio.vercel.app/match/last/na/PonssLoveless/8882?format=text&lang=es)
```

## Créditos

Creado por [Ponss17](https://www.instagram.com/ponss_jean/).

Mira mi otra API: [LosPerris Followage API](https://www.losperris.site/).

---
*Disclaimer: LosPerris Valorant Api isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.*
