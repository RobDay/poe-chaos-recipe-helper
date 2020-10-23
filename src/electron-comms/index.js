const getConfig = require("./get-config");
const handleClickOverlayItem = require("./handle-click-overlay-item");
const handleSetInteractable = require("./handle-set-interactable");
const handleToggleOverlay = require("./handle-toggle-overlay");

const registerHandlers = (config, overlayWindow) => {
  getConfig(config);
  handleClickOverlayItem(overlayWindow);
  handleSetInteractable(overlayWindow);
  handleToggleOverlay(overlayWindow);
};

module.exports = registerHandlers;
