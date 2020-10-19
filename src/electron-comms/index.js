const getConfig = require("./get-config");

const registerHandlers = (config) => {
  getConfig(config);
};

module.exports = registerHandlers;
