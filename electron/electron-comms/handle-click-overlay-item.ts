import { ipcMain } from "electron";
import { BrowserWindow } from "electron";
import { IPCAction } from "../../shared/constants";
import robot from "robotjs";

const handleClickOverlayItem = (overlayWindow: BrowserWindow) => {
  ipcMain.on(IPCAction.stackOverlayClicked, (event: any, arg: any) => {
    console.log("IT WAS CLICKED");
    event.returnValue = "pong";
    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    console.log("mouse pos");
    console.log(robot.getMousePos());
    // TODO: Need to get osx permissions popup
    robot.mouseClick();
  });
};

export default handleClickOverlayItem;
