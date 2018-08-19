// 合并配置文件, config.js 为默认配置文件， config.local.js 为用户配置文件

const path = require('path');
const fs = require('fs');
let config = require('../config.js');

module.exports = () => {
  try {
    const localConfigPath = path.join(__dirname, '../config.local.js');
    fs.accessSync(localConfigPath, fs.constants.R_OK | fs.constants.W_OK);
    localConfig = require(localConfigPath);
    return Object.assign(config, localConfig);
  } catch (err) {
    return config;
  }
}
