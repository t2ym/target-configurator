/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');
const { GulpDefaultRegistry, Configurable } = require('target-configurator');

class TargetConfigC1 extends Configurable(GulpDefaultRegistry, '@scoped/plugin-c1') {
  static basePath = module.parent.path; // module.parent is gulpfile.js in the base directory
  static configPath = module.path; // Overriding configPath is safe and robust
  // configure itself step by step
  _configure() {
    super._configure();
    Object.assign(this.path, {
      root: 'dist',
      '@scoped/plugin-c1': TargetConfigC1.packagePath,
    });
    Object.assign(this, { // dependent on this.path
    });
  }
}

const targetConfigC1 = new TargetConfigC1();

class TargetConfigC2 extends Configurable(GulpDefaultRegistry, '@scoped/plugin-c2') {
  static basePath = module.parent.path; // module.parent is gulpfile.js in the base directory
  static configPath = module.path; // Overriding configPath is safe and robust
  // configure itself step by step
  _configure() {
    super._configure();
    Object.assign(this.path, {
      root: 'dist',
      '@scoped/plugin-c2': TargetConfigC2.packagePath,
    });
    Object.assign(this, { // dependent on this.path
    });
  }
}

const targetConfigC2 = new TargetConfigC2();

module.exports = {
  targetConfigC1,
  targetConfigC2,
}
