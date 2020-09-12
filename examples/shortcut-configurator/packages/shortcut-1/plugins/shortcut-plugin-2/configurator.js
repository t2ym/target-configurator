/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');

const pluginName = 'shortcut-plugin-2';

module.exports = Object.assign(function shortcut_plugin2 (done) {
  console.log(pluginName, this.path, require(path.resolve(this.path.base, this.path.config, pluginName, 'shortcut-plugin-2-config.js'))['shortcut-plugin-2-config']);
  done();
}, {
  displayName: pluginName,
  dependencies: [ 'shortcut_plugin1' ],
});
