/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const fs = require('fs');
module.exports = function cwd_plugin (done) {
  // cwd is gurranteed to be this.path.base in overridden this.pre()
  console.log(cwd_plugin.name, this.path, JSON.parse(fs.readFileSync(`${this.path.config}/${cwd_plugin.name}/cwd_plugin-config.json`))['cwd_plugin-config']);
  done();
}
