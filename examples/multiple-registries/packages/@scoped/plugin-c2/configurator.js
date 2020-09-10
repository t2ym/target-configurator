/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');

const pluginName = '@scoped/plugin-c2';

const init = function (targetConfig) {
  //this.gulp.task('@scoped/plugin-c1');
}

const configurator = function (targetConfig) {
  return this.gulp.series('@scoped/plugin-c1')
}

module.exports = {
  init,
  configurator,
  name: pluginName,
  dependencies: [],
};