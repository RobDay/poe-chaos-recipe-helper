const { app, BrowserWindow, session, screen } = require("electron");
const { ipcMain } = require("electron");
const robot = require("robotjs");
const { dialog } = require("electron");

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

const registerHandlers = require("./electron-comms/index");
const fs = require("fs");
const util = require("util");
const jsyaml = require("js-yaml");
// TODO: These are all duplicates. How do I share them between electron and react
const TOGGLE_INVENTORY_OVERLAY = "TOGGLE_INVENTORY_OVERLAY";
const REFRESH_STASH_INFO = "REFRESH_STASH_INFO";

// TODO: Figure out how to share constnats with react layer
const MANAGE_INTERACTION_KEY = "set-ignore-mouse-events";

let mainWindow;
let overlayWindow;
let configFile;

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

const whenReady = async () => {
  await loadConfigFile();
  const cookie = {
    url: "https://www.pathofexile.com",
    name: "POESESSID",
    value: configFile.account.poeSessID,
  };
  session.defaultSession.cookies.set(cookie);
  createMainWindow();
  createOverlay();
  registerIPCListeners();
  registerHandlers(configFile);
};

const loadConfigFile = async () => {
  console.log("llll");
  const configPath = app.getPath("userData") + "/config.yaml";
  console.log("jjjj");
  const fileAccess = util.promisify(fs.access);
  console.log("00");
  try {
    const fileReadable = await fileAccess(configPath, fs.constants.R_OK);
  } catch {
    const copyFile = util.promisify(fs.copyFile);
    const copied = await copyFile(`${__dirname}/../config.yaml`, configPath);

    const options = {
      type: "info",
      buttons: ["Ok"],
      defaultId: 2,
      title: "Initial config created",
      message: `Config file created at ${configPath}. Please edit it based on your account. Restart the app when done`,
    };
    console.log("dd");
    dialog.showMessageBoxSync(null, options);
    app.exit(0);
  }

  const readFile = util.promisify(fs.readFile);
  const file = await readFile(configPath);
  configFile = jsyaml.load(file);
};

app.whenReady().then(whenReady);
