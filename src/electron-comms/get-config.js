const { ipcMain } = require("electron");
const GET_CONFIG = "GET_CONFIG";

const getConfigHandler = (config) => {
  ipcMain.handle(GET_CONFIG, (event, arg) => {
    console.log("returning a config");
    console.log(config);
    return config;
  });
};

module.exports = getConfigHandler;
