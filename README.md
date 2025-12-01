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

### 3. Comandos del Bot
Copia el código generado en la web y pégalo en tu chat.

#### 📝 Ejemplos de Respuesta (Español)

**Comando de Rango (!rank):**
- *Tipo 1*: "actualmente estoy en Ascendant 1"
- *Tipo 2*: "actualmente estoy en Ascendant 1 con 50 puntos"
- *Tipo 3*: "actualmente estoy en Ascendant 1 con 50 puntos, mi mmr es de 1200"

**Comando de Última Partida (!lastmatch):**
- *Tipo 1*: "mi última partida fue en Ascent con Jett gané 23 puntos"
- *Tipo 2*: "mi última partida fue en Ascent con Jett gané 23 puntos (13/5/8)"
- *Tipo 3*: "mi última partida fue en Ascent con Jett gané 23 puntos (13/5/8 y 45.2% HS)"

---

## 🤖 Plataformas Soportadas

| Plataforma | Comando |
|------------|---------|
| **Nightbot** | `$(urlfetch ...)` |
| **StreamElements** | `${customapi ...}` |
| **Fossabot** | `$(customapi ...)` |
| **Streamlabs** | `{readapi ...}` |

---

### 🎛️ Personalización Total
Configura el bot exactamente como lo quieres:
- **Idioma**: Respuestas en Español o Inglés.
- **Plataforma**: Compatible con Nightbot, StreamElements, Fossabot y Streamlabs.
- **Formato**: Elige qué información mostrar (Solo Rango, con Puntos, con ELO, KDA, HS%, etc.).

### 📊 Visualización Completa
No es solo un generador de comandos. La web te permite:
- Ver tu **progreso de MMR** en un gráfico interactivo.
- Analizar tu **última partida** con detalles de KDA y porcentaje de Headshots.
- Guardar tus **búsquedas recientes** para acceso rápido.

### 🌍 Soporte Multi-Región
Funciona para todas las regiones competitivas de Valorant:
- **NA** (North America)
- **EU** (Europe)
- **LATAM** (Latin America)
- **BR** (Brazil)
- **KR** (Korea)
- **AP** (Asia Pacific)

---

## © Créditos y Licencia

Creado con ❤️ por **[Ponss17](https://www.instagram.com/ponss_jean/)**.

Mira mi otra API: [LosPerris Followage API](https://www.losperris.site/).

*Disclaimer: LosPerris Valorant Api no está respaldado por Riot Games y no refleja los puntos de vista u opiniones de Riot Games ni de nadie oficialmente involucrado en la producción o gestión de las propiedades de Riot Games. Riot Games y todas las propiedades asociadas son marcas comerciales o marcas registradas de Riot Games, Inc.*
