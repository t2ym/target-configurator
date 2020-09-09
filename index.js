/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2020 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const path = require('path');
const fs = require('fs');
const GulpDefaultRegistry = require('undertaker-registry');

const Configurable = (base, _package) => class TargetConfigBase extends base {
  constructor() {
    super();
  }
  init(gulpInst) {
    super.init(gulpInst);
    this.gulp = gulpInst;
    this._configure();
    this._resolveConfig();
  }
  get(name) {
    let task = super.get(name);
    if (!task) {
      task = this.task(name); // register plugin
    }
    return task;
  }
  set(name, fn) {
    let boundFn = fn.bind(this);
    boundFn.displayName = fn.displayName;
    boundFn.description = fn.description;
    boundFn.flags = fn.flags;
    return super.set(name, boundFn);
  }
  resolveConfiguratorPath(pluginName) {
    let configuratorJs = 'configurator.js';
    let pluginConfiguratorPath = path.resolve(this.constructor.packagePath, this.path.plugins, pluginName, configuratorJs); // local
    if (fs.existsSync(pluginConfiguratorPath)) {
      return pluginConfiguratorPath;
    }
    if (pluginName.startsWith('@')) { // scoped
      let packageNameSplit = pluginName.split('/');
      let packageName;
      switch (packageNameSplit.length) {
      case 1: // "@plugin-scope"
        packageName = path.join(pluginName, 'default'); // "@plugin-scope/default"
        break;
      case 2: // "@plugin-scope/name"
        packageName = pluginName;
        break;
      default: // "@plugin-scope/name/..."
        if (packageNameSplit[packageNameSplit.length - 1] === configuratorJs) {
          // "@plugin-scope/name/configurator.js"
          packageNameSplit.pop();
          packageName = packageNameSplit.join('/');
        }
        else {
          // "@plugin-scope/name/subdir"
          packageName = pluginName;
        }
        break;
      }
      try {
        pluginConfiguratorPath = require.resolve(path.join(packageName, configuratorJs)); // scoped plugin
        if (fs.existsSync(pluginConfiguratorPath)) {
          return pluginConfiguratorPath;
        }
      }
      catch (e) {}
    }
    throw new Error(`Configurable.resolveConfiguratorPath: failed to resolve pluginName "${pluginName}"`);
  }
  // register gulp task
  task(pluginName) {
    const configuratorPath = this.resolveConfiguratorPath(pluginName);
    const plugin = require(configuratorPath);
    if (plugin.name !== pluginName) {
      throw new Error(`task("${pluginName}"): plugin.name === ${plugin.name} does not match`);
    }
    if (typeof plugin.init === 'function') {
      plugin.init.call(this, this);
    }
    return this.gulp.task(pluginName,
      this.gulp.series(
        Object.assign((done) => {
          if (Array.isArray(plugin.dependencies)) {
            plugin.dependencies.forEach(dependency => {
              if(!(this[dependency] && this[dependency].done)) {
                throw new Error(`plugin task "${pluginName}": dependent task "${dependency}" has not completed`);
              }
            });
          }
          done();
        }, { displayName: `${pluginName} check dependencies` }),
        // Note: task function is bound to this since gulp.series() bypasses registry.set(name, fn)
        Object.assign(plugin.configurator.call(this, this).bind(this), { displayName: `${pluginName} configurator` }),
        Object.assign((done) => {
          this[pluginName] = this[pluginName] || {};
          this[pluginName].done = true;
          done();
        }, { displayName: `${pluginName} done` }),
      )
    );
  }
  // get package path even from within the package itself
  static packagePath = (() => {
    try {
      let main = require.resolve(_package);
      if (main) {
        return path.dirname(main);
      }
    }
    catch (e) {}
    let dirname = __dirname;
    let packageName;
    while (!packageName) {
      let packagePath = path.resolve(dirname, 'package.json');
      if (fs.existsSync(packagePath)) {
        let _package = require(packagePath);
        packageName = _package.name;
        break;
      }
      dirname = path.resolve(dirname, '..');
      if (dirname === '/') {
        break;
      }  
    }
    if (packageName === _package) {
      return dirname;
    }
    else {
      return path.resolve(__dirname, '..');
    }
  })();
  static needResolution = Symbol('need resolution');
  static basePath = module.parent.parent.path;
  static configPath = __dirname;
  // delayed resolution of configurations 
  _resolveConfig() {
    for (let config in this) {
      if (this[config] && typeof this[config] === 'object' && this[config][this.constructor.needResolution]) {
        for (let key in this[config]) {
          if (typeof this[config][key] === 'function') {
            this[config][key] = this[config][key].call(this);
          }
        }
      }
    }
  }
  // generate arguments for concurrently
  getConcurrentlyArguments(commands, ...names) {
    let args = names.map(command => `"${commands[command]}"`);
    return `--names "${names.join(',')}" ${args.join(' ')}`;
  }
  // reverse [ fullPath, urlPath ] mappings
  reverseMappings(mappings) {
    // [ urlPath, fullPath ] in directory path names
    let _mappings = JSON.parse(JSON.stringify(mappings)); // clone
    _mappings.sort((a, b) => {
      let _a = a[1] + (a[1].endsWith('/') ? '' : '/');
      let _b = b[1] + (b[1].endsWith('/') ? '' : '/');
      if (_a.length < _b.length) {
        if (_b.startsWith(_a)) {
          // a > b
          return 1;
        }
      }
      else if (_a.length > _b.length) {
        if (_a.startsWith(_b)) {
          // a < b
          return -1;
        }
      }
      return _a.localeCompare(_b);
    });
    return _mappings.map(([ fullPath, urlPath ]) => [ urlPath, fullPath ]);
  }
  // map a path with provided mappings
  mapper(mappings, _path) {
    let result;
    for (let [ original, mapped ] of mappings) {
      if (_path.startsWith(original + '/')) {
        result = path.join(mapped, _path.substring(original.length + '/'.length));
        break;
      }
    }
    if (!result) {
      throw new Error(`TargetConfigBase.mapper(): "${_path}" cannot be mapped`);
    }
    return result;
  }
  _configure() {
    this.path = {
      base: this.constructor.basePath,
      config: path.relative(this.constructor.basePath, this.constructor.configPath),
      plugins: 'plugins',
      sourcePackage: this.constructor.packagePath,
    };
  }
}

module.exports = {
  GulpDefaultRegistry,
  Configurable,
}