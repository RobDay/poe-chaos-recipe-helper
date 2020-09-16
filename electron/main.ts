import { app, session, BrowserWindow } from "electron";
import createOverlay from "./create-overlay-window";
import createMainWindow from "./create-main-window";
import bootstrapConfig from "./boostrap-config";
import registerHandlers from "./electron-comms/index";
import registerWorkers from "./workers";
import log from "electron-log";
let mainWindow: BrowserWindow | null;
let overlayWindow: BrowserWindow | null;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

const whenReady = async () => {
  log.transports.console.level = "info";
  const configFile = await bootstrapConfig();
  const cookie = {
    url: "https://www.pathofexile.com",
    name: "POESESSID",
    value: configFile.account.poeSessID,
  };
  session.defaultSession.cookies.set(cookie);
  mainWindow = createMainWindow();
  // mainWindow.webContents.openDevTools();
  overlayWindow = createOverlay();
  mainWindow?.on("closed", () => {
    mainWindow = null;
  });
  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
  registerHandlers(configFile, overlayWindow);
  registerWorkers(configFile);
};

app.whenReady().then(whenReady);
