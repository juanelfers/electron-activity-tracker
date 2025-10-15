# Activity Tracker (Dark)

Electron app with **dark mode**, **screen recording** (Start/Stop), and **screenshots**.
Includes **electron-builder** configuration to package for macOS/Windows/Linux.

## What is electron-builder?
It’s a tool that packages your Electron app into native installers (DMG for macOS, NSIS/EXE for Windows, AppImage for Linux).
It handles code signing/notarization and can integrate with auto-updates.
In this project, it’s already configured with a default `appId` and common build targets.

## Requirements
- Node 18+
- npm

## Development
```bash
npm i
npm start
```

## Build (installers)
```bash
npm run dist
```
The build artifacts will be generated in the `dist/` folder.

> To sign or notarize builds on macOS or Windows, you’ll need certificates/credentials.
> `electron-builder` supports environment variables for that.

## Sentry (optional)
```bash
npm i -D @sentry/electron
SENTRY_DSN=<your_dsn> npm start
```

## Notes
- On macOS, you must enable **Screen Recording** in Security & Privacy preferences.
- The **Start recording** button begins capturing; **Stop** ends it and provides a `.webm` **Download** link.
- **Screenshot** adds the image to the gallery.
