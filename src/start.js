const { app, BrowserWindow, session } = require("electron");
const { ipcMain } = require("electron");
const robot = require("robotjs");

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

const path = require("path");
const url = require("url");
const {
  HIDE_INVENTORY_OVERLAY,
  SHOW_INVENTORY_OVERLAY,
  REFRESH_STASH_INFO,
} = require("./constants");
// TODO: Figure out how to share constnats with react layer
const MANAGE_INTERACTION_KEY = "set-ignore-mouse-events";

const mainWindowDefault = true;
let mainWindow;
let overlayWindow;

function createOverlay() {
  console.log("Creating overlays");
  process.stdout.write("your output to command prompt console or node js ");
  overlayWindow = new BrowserWindow({
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
      webSecurity: false,
    },
    // acceptFirstMouse: true
  });
  overlayWindow.hide();

  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  console.log("here");

  overlayWindow.loadURL(
    process.env.ELECTRON_OVERLAY_START_URL ||
      url.format({
        pathname: path.join(__dirname, "/../public/index.html?overlay"),
        protocol: "file:",
        slashes: true,
      })
  );

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 405,
    height: 70,
    transparent: true,
    frame: false,
    // alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(
    process.env.ELECTRON_MAIN_START_URL ||
      url.format({
        pathname: path.join(__dirname, "/../public/index.html?mainWindow"),
        protocol: "file:",
        slashes: true,
      })
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  const cookie = {
    url: "https://www.pathofexile.com",
    name: "POESESSID",
    value: "***REMOVED***",
  };
  session.defaultSession.cookies.set(cookie);
  createMainWindow();
  createOverlay();
  registerIPCListeners();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

function registerIPCListeners() {
  ipcMain.on("handle-clicked-stash-overlay-item", (event, arg) => {
    event.returnValue = "pong";
    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    console.log("mouse pos");
    console.log(robot.getMousePos());
    // TODO: Need to get osx permissions popup
    robot.mouseClick();
  });

  ipcMain.on(MANAGE_INTERACTION_KEY, (event, arg) => {
    console.log("Setting ignore to" + arg);
    if (arg) {
      overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      overlayWindow.setIgnoreMouseEvents(false);
    }
  });

  ipcMain.on(HIDE_INVENTORY_OVERLAY, (event, arg) => {
    overlayWindow.hide();
  });
  ipcMain.on(SHOW_INVENTORY_OVERLAY, (event, arg) => {
    overlayWindow.show();
  });
  ipcMain.on(REFRESH_STASH_INFO, (event, arg) => {});
}
