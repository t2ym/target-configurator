/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');
const { GulpDefaultRegistry, Configurable } = require('target-configurator');

console.log('targetConfig1: module.parent.id', module.parent.id)
class TargetConfig1 extends Configurable(GulpDefaultRegistry, 'shortcut-1') {
  static basePath = module.parent.path; // module.parent is gulpfile.js in the base directory
  static configPath = module.path; // Overriding configPath is safe and robust
  // override this.pre() to check process.cwd() before each task
  pre(plugin) {
    super.pre(plugin);
    if (this.constructor.basePath !== process.cwd()) {
      throw new Error(`${TargetConfig1.name}: cwd ${process.cwd()} is expected to match with basePath ${this.constructor.basePath}`);
    }
  }
  // configure itself step by step
  _configure() {
    super._configure();
    Object.assign(this.path, {
      root: 'dist',
      'shortcut-1': TargetConfig1.packagePath,
    });
    Object.assign(this, { // dependent on this.path
    });
  }
}

const targetConfig1 = new TargetConfig1();

module.exports = targetConfig1;
