const { ipcMain } = require("electron");
import { BrowserWindow } from "electron";
import { IPCAction } from "../../shared/constants";
import log from "electron-log";
// TODO: Figure out how to share constnats with react layer

const handleSetInteractable = (overlayWindow: BrowserWindow) => {
  ipcMain.on(IPCAction.manageInteractable, (event: any, arg: any) => {
    log.info("Setting ignore to" + arg);
    if (arg) {
      overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      overlayWindow.setIgnoreMouseEvents(false);
    }
  });
};

export default handleSetInteractable;
