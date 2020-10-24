const { ipcMain } = require("electron");
import { Config } from "../../shared/models";
import { IPCAction } from "../../shared/constants";

const getConfigHandler = (config: Config) => {
  ipcMain.handle(IPCAction.requestConfig, (event: any, arg: any) => {
    console.log("returning a config");
    console.log(config);
    return config;
  });
};

export default getConfigHandler;
