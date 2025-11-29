# LosPerris - Valorant Api

**Tu Hub definitivo para comandos de Valorant.**
Diseñado para streamers, esta herramienta te permite generar comandos personalizados para tu chat (Nightbot, StreamElements, etc.) sin tocar una sola línea de código.

## ✨ Novedades
- **Diseño Premium**: Nueva interfaz oscura inspirada en Valorant.
- **Traducción de Rangos**: Los nombres de los rangos se traducen automáticamente (ej. "Gold" -> "Oro").
- **Historial de MMR**: Gráfico interactivo para ver tu progreso de ELO en las últimas partidas.
- **Fecha de Partida**: Ahora puedes ver cuándo se jugó la última partida.
- **Mejoras de Velocidad**: Carga de perfil ultra-rápida.
- **Mensajes de Error**: Avisos claros si el usuario no existe o hay problemas de conexión.

## 🚀 Cómo Usar (Web)

No necesitas instalar nada. Todo funciona desde la web.

### 1. Busca tu Perfil
Ingresa tu **Riot ID** y **Tag** (ej. `PonssLoveless #8882`) y selecciona tu región.
- Verás tu **Rango Actual** con tu ELO y RR (traducido a tu idioma).
- Verás tu **Última Partida** con el resultado, KDA, HS% y la fecha.
- Verás un **Gráfico** con tu historial de MMR.

### 2. Configura tu Bot
Una vez carguen tus datos, baja a la sección **"Configuración del Bot"**.
Aquí puedes personalizar cómo quieres que responda el bot en tu chat:

- **Plataforma**: Elige tu bot (Nightbot, StreamElements, Fossabot, Streamlabs).
- **Idioma**: ¿Tu stream es en Español o Inglés? (Esto afecta la respuesta del bot).
- **Formato de Rango**:
    - *Solo Rango*: "Gold 1"
    - *Rango + Puntos*: "Gold 1 - 50 RR"
    - *Completo*: "Gold 1 - 50 RR (1200 ELO)"

### 3. ¡Copia y Pega!
En la sección **"Comandos del Bot"**, verás que los códigos se actualizan automáticamente según tu configuración.
Solo dale al botón **COPY** y pégalo en el chat de tu stream.

---

## 🤖 Plataformas Soportadas

El generador web soporta nativamente:
- **Nightbot**: `$(urlfetch ...)`
- **StreamElements**: `${customapi ...}`
- **Fossabot**: `$(customapi ...)`
- **Streamlabs**: `{readapi ...}`

---

## 🛠️ Para Desarrolladores (API Endpoints)

Si eres dev y quieres usar la API directamente, aquí tienes los endpoints:

### Rango
`GET /rank/:region/:name/:tag`
- `?format=text` (Opcional: respuesta en texto plano)

### Última Partida
`GET /match/last/:region/:name/:tag`
- `?format=text` (Opcional: respuesta en texto plano)

### Historial
`GET /history/:region/:name/:tag`
- Devuelve el historial de MMR para gráficos.

---

## Créditos

Creado con ❤️ por [Ponss17](https://www.instagram.com/ponss_jean/).
Mira mi otra API: [LosPerris Followage API](https://www.losperris.site/).

*Disclaimer: LosPerris Valorant Api isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.*
