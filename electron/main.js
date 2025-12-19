const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Detecta se está em desenvolvimento ou produção
const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    icon: path.join(__dirname, '../public/pwa-512x512.png'),
    title: 'Trade Control Hub',
    backgroundColor: '#0F1419',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Carrega a URL correta baseado no ambiente
  if (isDev) {
    // Desenvolvimento: carrega do servidor Vite
    mainWindow.loadURL('http://localhost:8080');
    // Abre DevTools automaticamente em dev
    mainWindow.webContents.openDevTools();
  } else {
    // Produção: carrega os arquivos buildados
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Abre links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Quando o Electron estiver pronto
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Fecha o app quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
