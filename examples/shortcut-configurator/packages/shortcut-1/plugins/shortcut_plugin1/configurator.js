/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');

module.exports = function shortcut_plugin1 (done) {
  console.log('shortcut_plugin1', this.path, require(path.resolve(this.path.base, this.path.config, shortcut_plugin1.name, 'shortcut_plugin1-config.js'))['shortcut_plugin1-config']);
  done();
}
