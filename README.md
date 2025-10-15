# Activity Tracker (Dark)

App de Electron con **modo dark**, **grabación de pantalla** (Start/Stop) y **screenshots**.
Incluye configuración de **electron-builder** para empaquetar en macOS/Windows/Linux.

## ¿Qué es electron-builder?
Es una herramienta que empaqueta tu app de Electron en instaladores nativos (DMG para macOS, NSIS/EXE para Windows, AppImage para Linux), maneja firma/notarización y puede integrarse con auto-updates. En este proyecto ya está configurado con un `appId` y targets comunes.

## Requisitos
- Node 18+
- npm

## Desarrollo
```bash
npm i
npm start
```

## Build (instaladores)
```bash
npm run dist
```
Los artefactos quedarán en `dist/`.

> Para firmar / notarizar en macOS o Windows vas a necesitar certificados/credenciales. `electron-builder` soporta variables de entorno para eso.

## Sentry (opcional)
```bash
npm i -D @sentry/electron
SENTRY_DSN=<tu_dsn> npm start
```

## Notas
- En macOS debés habilitar **Screen Recording** en Preferencias de Seguridad.
- El botón **Start recording** comienza a grabar; **Stop** detiene y ofrece **Download** del `.webm`.
- **Screenshot** agrega la imagen a la galería.
