import handleSetInteractable from "./handle-set-interactable";

const { ipcMain } = require("electron");
import { IPCAction } from "../../shared/constants";
import log from "electron-log";
import { BrowserWindow } from "electron";

const handleToggleOverlay = (overlayWindow: BrowserWindow) => {
  ipcMain.on(IPCAction.toggleInventoryOverlay, (event: any, arg: any) => {
    log.info("on Toggle Overlay");
    log.info(overlayWindow.webContents.id);
    if (overlayWindow.isVisible()) {
      log.info("hiding");
      const _ = overlayWindow && overlayWindow.hide();
    } else {
      log.info("showing");
      overlayWindow && overlayWindow.show();
    }
  });
};

export default handleToggleOverlay;
