const path = require('path');
const { app, BrowserWindow, session, desktopCapturer } = require('electron');

// Optional Sentry in main
if (process.env.SENTRY_DSN) {
  try {
    const Sentry = require('@sentry/electron/main');
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 0.1
    });
    process.on('uncaughtException', (err) => Sentry.captureException(err));
    process.on('unhandledRejection', (err) => Sentry.captureException(err));
  } catch (e) {
    console.warn('[Sentry] Not enabled:', e && e.message);
  }
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1040,
    height: 720,
    backgroundColor: '#0b0f17',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 10 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(async () => {
  session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen'] });
      if (!sources.length) throw new Error('No screen sources found');
      callback({ video: sources[0], audio: false });
    } catch (err) {
      console.error('setDisplayMediaRequestHandler error:', err);
      callback({}); // deny
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
