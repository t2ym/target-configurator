/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');
const { GulpDefaultRegistry, Configurable } = require('target-configurator');

class TargetConfigB extends Configurable(GulpDefaultRegistry, 'package-b') {
  static basePath = module.parent.path; // module.parent is gulpfile.js in the base directory
  static configPath = module.path; // Overriding configPath is safe and robust
  // configure itself step by step
  _configure() {
    super._configure();
    Object.assign(this.path, {
      root: 'dist',
      'package-b': TargetConfigB.packagePath,
    });
    Object.assign(this, { // dependent on this.path
    });
  }
}

const targetConfigB = new TargetConfigB();

module.exports = targetConfigB;
