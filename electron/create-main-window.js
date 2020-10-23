const { BrowserWindow, screen } = require("electron");
// const port = process.env.PORT ? process.env.PORT - 100 : 300
const port = 3000
process.env.ELECTRON_ENABLE_LOGGING = true;
if (process.env.NODE_ENV === "development") {
  process.env.ELECTRON_MAIN_START_URL = `http://localhost:${port}/?mainWindow`
process.env.ELECTRON_OVERLAY_START_URL = `http://localhost:${port}/?overlay`
}


function createMainWindow() {
  const width = 405;
  const height = 70;
  let display = screen.getPrimaryDisplay();
  const screenWidth = display.bounds.width;
  const screenHeight = display.bounds.height;
  const x = Math.floor(screenWidth / 2 - width / 2);
  const y = Math.floor(screenHeight - height);

  const mainWindow = new BrowserWindow({
    width,
    height,
    x: x,
    y: y,
    center: false,
    transparent: true,
    // focusable: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });
  mainWindow.loadURL(
    process.env.ELECTRON_MAIN_START_URL ||
      // `file://${__dirname}/../build/index.html?mainWindow`
      `file://${__dirname}/index.html?mainWindow`
  );
  console.log("@@@");

  return mainWindow;
}

export default createMainWindow;
