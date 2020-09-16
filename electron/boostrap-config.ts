import fs from "fs";
import util from "util";
import { app } from "electron";
import { dialog } from "electron";
import jsyaml from "js-yaml";
import log from "electron-log";

const loadConfigFile = async () => {
  const configPath = app.getPath("userData") + "/config.yaml";
  const fileAccess = util.promisify(fs.access);
  try {
    await fileAccess(configPath, fs.constants.R_OK);
  } catch {
    const copyFile = util.promisify(fs.copyFile);
    log.info("Currently in ");
    log.info(__dirname);
    await copyFile(`${__dirname}/../config.yaml`, configPath);

    const options = {
      type: "info",
      buttons: ["Ok"],
      defaultId: 2,
      title: "Initial config created",
      message: `Config file created at ${configPath}. Please edit it based on your account. Restart the app when done`,
    };
    dialog.showMessageBoxSync(null!, options);
    app.exit(0);
  }

  const readFile = util.promisify(fs.readFile);
  const file = await readFile(configPath);
  const configFile = jsyaml.load(String(file));
  return configFile;
};

export default loadConfigFile;
