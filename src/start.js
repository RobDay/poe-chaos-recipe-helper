const { app, BrowserWindow, session } = require("electron");
const { ipcMain } = require("electron");
const robot = require("robotjs");

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

const path = require("path");
const url = require("url");

const mainWindowDefault = false;
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
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    // acceptFirstMouse: true
  });

  console.log("here");
  ipcMain.on("handle-clicked-stash-overlay-item", (event, arg) => {
    event.returnValue = "pong";
    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    console.log("mouse pos");
    console.log(robot.getMousePos());
    // TODO: Need to get osx permissions popup
    robot.mouseClick();
    overlayWindow.setIgnoreMouseEvents(false);
  });

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
    width: 468,
    height: 40,
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
    value: "f7e89fad89933d67520f220634832cc5",
  };
  session.defaultSession.cookies.set(cookie);
  mainWindowDefault ? createMainWindow() : createOverlay();
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
