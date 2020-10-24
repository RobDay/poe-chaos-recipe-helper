import handleSetInteractable from "./handle-set-interactable";

const { ipcMain } = require("electron");
import { IPCAction } from "../../shared/constants";
import { BrowserWindow } from "electron";

const handleToggleOverlay = (overlayWindow: BrowserWindow) => {
  ipcMain.on(IPCAction.toggleInventoryOverlay, (event: any, arg: any) => {
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
