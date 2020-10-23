import getConfig from "./get-config";
import handleClickOverlayItem from "./handle-click-overlay-item";
import handleSetInteractable from "./handle-set-interactable";
import handleToggleOverlay from "./handle-toggle-overlay";

const registerHandlers = (config, overlayWindow) => {
  getConfig(config);
  handleClickOverlayItem(overlayWindow);
  handleSetInteractable(overlayWindow);
  handleToggleOverlay(overlayWindow);
};

export default registerHandlers;
