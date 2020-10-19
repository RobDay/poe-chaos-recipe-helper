const { app, BrowserWindow, session, screen } = require("electron");
const { ipcMain } = require("electron");
const robot = require("robotjs");

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

const path = require("path");
const url = require("url");
console.log("BANANA");
// TODO: These are all duplicates. How do I share them between electron and react
const TOGGLE_INVENTORY_OVERLAY = "TOGGLE_INVENTORY_OVERLAY";
const REFRESH_STASH_INFO = "REFRESH_STASH_INFO";

const REFRESH_STASH_INFO_PAYLOAD = "REFRESH_STASH_INFO_PAYLOAD";
// TODO: Figure out how to share constnats with react layer
const MANAGE_INTERACTION_KEY = "set-ignore-mouse-events";

const mainWindowDefault = true;
let mainWindow;
let overlayWindow;

function createOverlay() {
  console.log("Creating overlays");
  process.stdout.write("your output to command prompt console or node js ");
  overlayWindow = new BrowserWindow({
    id: 2,
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

  console.log("here");

  console.log("%%%");
  overlayWindow.loadURL(
    process.env.ELECTRON_OVERLAY_START_URL ||
      `file://${__dirname}/../build/index.html?overlay`
  );
  console.log("^^^");

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
}

function createMainWindow() {
  const width = 405;
  const height = 70;
  let display = screen.getPrimaryDisplay();
  const screenWidth = display.bounds.width;
  const screenHeight = display.bounds.height;
  const x = Math.floor(screenWidth / 2 - width / 2);
  const y = Math.floor(screenHeight - height);

  mainWindow = new BrowserWindow({
    width,
    height,
    x: x,
    y: y,
    center: false,
    transparent: true,
    focusable: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });
  // mainWindow.loadURL(isDev ? ‘http://localhost:3000' : `file://${__dirname}/../build/index.html`);
  console.log("!!!");
  mainWindow.loadURL(
    process.env.ELECTRON_MAIN_START_URL ||
      `file://${__dirname}/../build/index.html?mainWindow`
  );
  console.log("@@@");

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

  ipcMain.on(REFRESH_STASH_INFO, (event, arg) => {
    console.log("refresh");
  });
  ipcMain.on(TOGGLE_INVENTORY_OVERLAY, (event, arg) => {
    console.log("on Toggle Overlay");
    console.log(overlayWindow.webContents.id);
    if (overlayWindow?.isVisible()) {
      console.log("hiding");
      overlayWindow && overlayWindow.hide();
    } else {
      console.log("showing");
      overlayWindow && overlayWindow.show();
    }
  });
}
