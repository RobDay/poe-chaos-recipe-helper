const { ipcMain } = require("electron");
const TOGGLE_INVENTORY_OVERLAY = "TOGGLE_INVENTORY_OVERLAY";

const handleToggleOverlay = (overlayWindow) => {
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
};

module.exports = handleToggleOverlay;
