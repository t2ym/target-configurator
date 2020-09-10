/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');

const pluginName = 'plugin-b2';

const configurator = function (targetConfig) {
  return this.gulp.series('plugin-b1')
}

module.exports = {
  configurator,
  name: pluginName,
  dependencies: [],
};