const { ipcMain } = require("electron");
import { Config } from "../../shared/models";
import log from "electron-log";
import { IPCAction } from "../../shared/constants";

const getConfigHandler = (config: Config) => {
  ipcMain.handle(IPCAction.requestConfig, (event: any, arg: any) => {
    log.info("returning a config");
    log.info(config);
    return config;
  });
};

export default getConfigHandler;
