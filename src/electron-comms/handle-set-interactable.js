const { ipcMain } = require("electron");
// TODO: Figure out how to share constnats with react layer
const MANAGE_INTERACTION_KEY = "set-ignore-mouse-events";

const handleSetInteractable = (overlayWindow) => {
  ipcMain.on(MANAGE_INTERACTION_KEY, (event, arg) => {
    console.log("Setting ignore to" + arg);
    if (arg) {
      overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      overlayWindow.setIgnoreMouseEvents(false);
    }
  });
};

module.exports = handleSetInteractable;
