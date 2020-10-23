const { ipcMain } = require("electron");
const robot = require("robotjs");

const handleClickOverlayItem = (overlayWindow) => {
  ipcMain.on("handle-clicked-stash-overlay-item", (event, arg) => {
    event.returnValue = "pong";
    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    console.log("mouse pos");
    console.log(robot.getMousePos());
    // TODO: Need to get osx permissions popup
    robot.mouseClick();
  });
};

export default handleClickOverlayItem;
