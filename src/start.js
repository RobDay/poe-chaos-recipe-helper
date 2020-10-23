const { app, session } = require("electron");
const createOverlay = require("./electron/create-overlay-window");
const createMainWindow = require("./electron/create-main-window");
const bootstrapConfig = require("./electron/boostrap-config");

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

const registerHandlers = require("./electron-comms/index");

let mainWindow;
let overlayWindow;

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
  const configFile = await bootstrapConfig();
  const cookie = {
    url: "https://www.pathofexile.com",
    name: "POESESSID",
    value: configFile.account.poeSessID,
  };
  session.defaultSession.cookies.set(cookie);
  mainWindow = createMainWindow();
  overlayWindow = createOverlay();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });
  registerHandlers(configFile, overlayWindow);
};

app.whenReady().then(whenReady);
