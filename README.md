# <img src="public/imgs/LosPerris-gamer.ico" width="40" alt="LosPerris Gamer"/> LosPerris - Valorant API

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

> **Hub para comandos de Valorant.**
> Diseñado para streamers, esta herramienta permite generar comandos personalizados para tu chat (Nightbot, StreamElements, etc.) sin tocar una sola línea de código.

---

## ✨ Novedades

- **🎨 Diseño Premium**: Nueva interfaz oscura inspirada en la estética de Valorant.
- **🌍 Traducción de Rangos**: Los nombres de los rangos se traducen automáticamente (ej. "Gold" -> "Oro").
- **📈 Historial de MMR**: Gráfico interactivo para visualizar tu progreso de ELO en las últimas partidas.
- **🕒 Fecha de Partida**: Visualización precisa de cuándo se jugó la última partida.
- **⚡ Velocidad**: Carga de perfil optimizada y ultra-rápida.
- **🛡️ Robustez**: Mensajes de error claros para usuarios inexistentes o problemas de conexión.

---

## 🚀 Cómo Usar (Web)

No necesitas instalar nada. Todo funciona directamente desde la web.

### 1. Busca tu Perfil
Ingresa tu **Riot ID** y **Tag** (ej. `PonssLoveless #8882`) y selecciona tu región.
- **Rango Actual**: ELO y RR traducidos.
- **Última Partida**: Resultado, KDA, HS% y fecha.
- **Gráfico**: Historial de MMR.

### 2. Configura tu Bot
Personaliza la respuesta del bot en la sección **"Configuración del Bot"**:
- **Plataforma**: Nightbot, StreamElements, Fossabot, Streamlabs.
- **Idioma**: Español o Inglés.
- **Formato**:
    - *Solo Rango*: "Gold 1"
    - *Rango + Puntos*: "Gold 1 - 50 RR"
    - *Completo*: "Gold 1 - 50 RR (1200 ELO)"

### 3. ¡Copia y Pega!
Copia el código generado en la sección **"Comandos del Bot"** y pégalo en tu chat.

---

## 🤖 Plataformas Soportadas

| Plataforma | Comando |
|------------|---------|
| **Nightbot** | `$(urlfetch ...)` |
| **StreamElements** | `${customapi ...}` |
| **Fossabot** | `$(customapi ...)` |
| **Streamlabs** | `{readapi ...}` |

---

## 🛠️ API Reference

Si eres desarrollador, puedes consumir la API directamente.

### Base URL
\`\`\`
https://tu-dominio-api.com
\`\`\`

### Endpoints

#### 1. Obtener Rango
Devuelve la información actual de rango del jugador.

\`\`\`http
GET /rank/:region/:name/:tag
\`\`\`

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `region` | `string` | Región del jugador (na, eu, ap, kr, latam, br) |
| `name` | `string` | Riot ID (nombre) |
| `tag` | `string` | Riot Tag (sin el #) |
| `format` | `query` | (Opcional) `text` para respuesta en texto plano |

#### 2. Última Partida
Obtiene estadísticas de la última partida jugada.

\`\`\`http
GET /match/last/:region/:name/:tag
\`\`\`

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `format` | `query` | (Opcional) `text` para respuesta en texto plano |

#### 3. Historial de MMR
Obtiene el historial de cambios de ELO para gráficos.

\`\`\`http
GET /history/:region/:name/:tag
\`\`\`

#### 4. Resumen Completo
Obtiene un resumen completo del perfil (Rango, Última Partida e Historial) en una sola llamada. Ideal para dashboards.

```http
GET /summary/:region/:name/:tag
```

---

## © Créditos y Licencia

Creado con ❤️ por **[Ponss17](https://www.instagram.com/ponss_jean/)**.

Mira mi otra API: [LosPerris Followage API](https://www.losperris.site/).

*Disclaimer: LosPerris Valorant Api no está respaldado por Riot Games y no refleja los puntos de vista u opiniones de Riot Games ni de nadie oficialmente involucrado en la producción o gestión de las propiedades de Riot Games. Riot Games y todas las propiedades asociadas son marcas comerciales o marcas registradas de Riot Games, Inc.*
