/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');

const pluginName = 'plugin-e1';

const configurator = function (targetConfig) {
  return function (done) {
    console.log(pluginName, this.path, require(path.resolve(this.path.base, this.path.config, pluginName, 'plugin-e1-config.js'))['plugin-e1-config']);
    done();
  }
}

module.exports = {
  configurator,
  name: pluginName,
  dependencies: [],
};