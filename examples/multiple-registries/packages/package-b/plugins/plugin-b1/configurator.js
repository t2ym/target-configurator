/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');

const pluginName = 'plugin-b1';

const configurator = function (targetConfig) {
  return function (done) {
    console.log('plugin-b1', this.path, require(path.resolve(this.path.base, this.path.config, pluginName, 'plugin-b1-config.js'))['plugin-b1-config']);
    done();
  }
}

module.exports = {
  configurator,
  name: pluginName,
  dependencies: [],
};