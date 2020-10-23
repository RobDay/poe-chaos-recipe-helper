const fs = require("fs");
const util = require("util");
const { app } = require("electron");
const { dialog } = require("electron");
const jsyaml = require("js-yaml");

const loadConfigFile = async () => {
  const configPath = app.getPath("userData") + "/config.yaml";
  const fileAccess = util.promisify(fs.access);
  try {
    await fileAccess(configPath, fs.constants.R_OK);
  } catch {
    const copyFile = util.promisify(fs.copyFile);
    await copyFile(`${__dirname}/../config.yaml`, configPath);

    const options = {
      type: "info",
      buttons: ["Ok"],
      defaultId: 2,
      title: "Initial config created",
      message: `Config file created at ${configPath}. Please edit it based on your account. Restart the app when done`,
    };
    dialog.showMessageBoxSync(null, options);
    app.exit(0);
  }

  const readFile = util.promisify(fs.readFile);
  const file = await readFile(configPath);
  const configFile = jsyaml.load(file);
  return configFile;
};

module.exports = loadConfigFile;
