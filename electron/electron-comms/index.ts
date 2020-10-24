import { BrowserWindow } from "electron";
import { Config } from "../../shared/models";
import getConfig from "./get-config";
import handleClickOverlayItem from "./handle-click-overlay-item";
import handleSetInteractable from "./handle-set-interactable";
import handleToggleOverlay from "./handle-toggle-overlay";

const registerHandlers = (config: Config, overlayWindow: BrowserWindow) => {
  getConfig(config);
  handleClickOverlayItem(overlayWindow);
  handleSetInteractable(overlayWindow);
  handleToggleOverlay(overlayWindow);
};

export default registerHandlers;
