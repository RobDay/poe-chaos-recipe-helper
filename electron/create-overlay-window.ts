import { BrowserWindow } from "electron";
import log from "electron-log";
// const port = process.env.PORT ? process.env.PORT - 100 : 3000
const port = 3000;
process.env.ELECTRON_ENABLE_LOGGING = "true";
if (process.env.NODE_ENV === "development") {
  process.env.ELECTRON_MAIN_START_URL = `http://localhost:${port}/?mainWindow`;
  process.env.ELECTRON_OVERLAY_START_URL = `http://localhost:${port}/?overlay`;
}

function createOverlay() {
  log.info("Creating overlays");
  process.stdout.write("your output to command prompt console or node js ");
  const overlayWindow = new BrowserWindow({
    width: 560,
    height: 560,
    x: 20,
    y: 180,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    // backgroundColor: "blue",
    focusable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
    // acceptFirstMouse: true
  });
  overlayWindow.hide();

  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  log.info("here");

  log.info("%%%");
  overlayWindow.loadURL(
    process.env.ELECTRON_OVERLAY_START_URL ||
      // `file://${__dirname}/../build/index.html?overlay`
      `file://${__dirname}/index.html?overlay`
  );

  //   overlayWindow.on("closed", () => {
  //     overlayWindow = null;
  //   });
  return overlayWindow;
}

export default createOverlay;
