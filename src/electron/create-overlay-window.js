const { BrowserWindow } = require("electron");

function createOverlay() {
  console.log("Creating overlays");
  process.stdout.write("your output to command prompt console or node js ");
  const overlayWindow = new BrowserWindow({
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

  //   overlayWindow.on("closed", () => {
  //     overlayWindow = null;
  //   });
  return overlayWindow;
}

module.exports = createOverlay;
