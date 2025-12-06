/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import stateKeeper from 'electron-window-state';

import MenuBuilder from './menu';
import { getSchedule } from './radiko';
import getStore from './store';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-schedule', async (event) => {
  const schedule = await getSchedule();
  console.log(schedule);

  event.reply('ipc-schedule', schedule);
});

ipcMain.on('ipc-set-pinned', async (event, arg) => {
  const pinned = arg ?? false;
  const store = await getStore();

  store.set('pinned', pinned);

  const execPath = process.env.PORTABLE_EXECUTABLE_FILE || process.execPath;

  app.relaunch({
    execPath,
    args: process.argv.slice(1),
  });

  app.quit();
});

ipcMain.on('ipc-get-pinned', async (event) => {
  const store = await getStore();

  event.reply('ipc-get-pinned', store.get('pinned'));
});

ipcMain.on('ipc-mouse-event', async (event, arg) =>
  mainWindow?.setIgnoreMouseEvents(!(arg ?? false), { forward: true }),
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();

  if (process.env.MAIN_ARGS) {
    const parameters = [
      ...process.env.MAIN_ARGS.matchAll(/"[^"]+"|[^\s"]+/g),
    ].flat();

    if (parameters.find((str) => str.includes('debugging-port'))) {
      const port = parameters
        .filter((str) => str.includes('debugging-port'))[0]
        .split('=')[1];

      app.commandLine.appendSwitch('remote-debugging-port', port);
    }
  }
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const WIDTH = isDebug ? 1028 : 420;

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const windowState = stateKeeper({
    defaultHeight: 728,
  });

  const store = await getStore();
  const isPinned = store.get('pinned') ?? false;

  mainWindow = new BrowserWindow({
    show: false,
    x: windowState.x,
    y: windowState.y,
    width: WIDTH,
    height: windowState.height,
    minWidth: WIDTH,
    maxWidth: WIDTH,
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    frame: !isPinned,
    transparent: isPinned,
    skipTaskbar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.setIgnoreMouseEvents(isPinned, { forward: true });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  windowState.manage(mainWindow);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
