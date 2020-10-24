import { ipcMain } from "electron";
import { BrowserWindow } from "electron";
import { IPCAction } from "../../shared/constants";
import robot from "robotjs";
import log from "electron-log";

const handleClickOverlayItem = (overlayWindow: BrowserWindow) => {
  ipcMain.on(IPCAction.stackOverlayClicked, (event: any, arg: any) => {
    log.info("IT WAS CLICKED");
    event.returnValue = "pong";
    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    log.info("mouse pos");
    log.info(robot.getMousePos());
    // TODO: Need to get osx permissions popup
    robot.mouseClick();
  });
};

export default handleClickOverlayItem;
