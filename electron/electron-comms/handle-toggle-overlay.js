import handleSetInteractable from "./handle-set-interactable";

const { ipcMain } = require("electron");
const TOGGLE_INVENTORY_OVERLAY = "TOGGLE_INVENTORY_OVERLAY";

const handleToggleOverlay = (overlayWindow) => {
  ipcMain.on(TOGGLE_INVENTORY_OVERLAY, (event, arg) => {
    console.log("on Toggle Overlay");
    console.log(overlayWindow.webContents.id);
    if (overlayWindow.isVisible()) {
      console.log("hiding");
      const _ = overlayWindow && overlayWindow.hide();
    } else {
      console.log("showing");
      overlayWindow && overlayWindow.show();
    }
  });
};

export default handleToggleOverlay;
