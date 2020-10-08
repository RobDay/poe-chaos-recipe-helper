const { app, BrowserWindow, session } = require("electron");
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

const path = require("path");
const url = require("url");

let mainWindow;
let overlayWindow;

function createOverlay() {
  overlayWindow = new BrowserWindow({
    width: 1134,
    height: 1130,
    x: 7,
    y: 200,
    transparent: true,
    frame: false,
    // alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
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
  const cookie = {
    url: "https://www.pathofexile.com",
    name: "POESESSID",
    value: "f7e89fad89933d67520f220634832cc5",
  };
  session.defaultSession.cookies.set(cookie);
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

app.whenReady().then(createMainWindow);

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
