const { ipcMain } = require("electron");
const GET_CONFIG = "GET_CONFIG";

const getConfigHandler = (config) => {
  ipcMain.on(GET_CONFIG, (event, arg) => {
    return config;
  });
};

module.exports = getConfigHandler;
