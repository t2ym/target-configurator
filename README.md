[![npm version](https://badge.fury.io/js/target-configurator.svg)](https://badge.fury.io/js/target-configurator)

# target-configurator

## [Example Usage in `thin-hook`](https://github.com/t2ym/thin-hook/blob/module/gulpfile.js)
- [thin-hook Issue #386 Portable configurators for plugins to improve developer experience](https://github.com/t2ym/thin-hook/issues/386)

## `gulpfile.js` - register gulp tasks
```js
// In package-directory/gulpfile.js
const gulp = require('gulp');

const targetConfig = require('./config-directory/config.js');
gulp.registry(targetConfig); // targetConfig as custom gulp registry

gulp.task('plugin-name'); // register a task configurable via source-package/plugins/plugin-name/configurator.js

gulp.task('@scoped/plugin-name'); // regiter a task configurable via @scoped/plugin-name/configurator.js

```

## Directory Structure

```
package-directory/
  package.json - dev dependent on target-configurator
  config-directory/
    config.js - export targetConfig object
    plugin-name/
      plugin-specific-config.js (any types)
    @scoped/
      plugin-name/
        plugin-specific-config.js (any types)
  dest/ - destination
    configured-source-code.js (any types) - generated by configurator.js
    ...
  node_modules/
    target-configurator/
      index.js
    source-package/ - this can be the same as package-directory
      package.json
      plugins/
        plugin-name/
          configurator.js
          config-source1.js (any types)
          ...
        plugin-name2/
        ...
    @scoped/
      plugin-name/
        package.json
        configurator.js
        config-source.js (any types)
        ...
  
```

## `config-directory/config.js` - targetConfig object for configurators
```js
// In package-directory/config-directory/config.js
const { Configurable, GulpDefaultRegistry } = require('target-configurator');

class TargetConfig extends Configurable(GulpDefaultRegistry, 'source-package') {
  static basePath = module.parent.path; // module.parent is gulpfile.js in the base directory
  static configPath = module.path; // Overriding configPath is safe and robust
  pre(plugin) { // optionally confirm process.cwd() matches with the base path
    super.pre(plugin);
    if (this.constructor.basePath !== process.cwd()) {
      throw new Error(`${TargetConfig1.name}: cwd ${process.cwd()} is expected to match with basePath ${this.constructor.basePath}`);
    }
  }
  _configure() {
    super._configure();
    Object.assign(this.path, {
      // common paths for the project
      root: 'webroot', // this is just an example; any name with any value for the project
      ...
    });
    Object.assign(this, {
      "plugin-name": {
        "config": "value",
        ...
      },
      "@scoped/plugin-name": {
        "config": "value",
        ...
      },
    });
  }
}

let targetConfig = new TargetConfig();

module.exports = targetConfig;
```

## `source-package/plugins/plugin-name/configurator.js` - configurator
- Full-featured plugin
```js
// example configurator with configurable 2-pass source file generation
const path = require('path');
const { preprocess } = require('preprocess');
const through = require('through2');

const pluginName = 'policy';

const init = function (targetConfig) {
  // init for the plugin
}

const configurator = function (targetConfig) {
  const configPath = path.resolve(this.path.base, this.path.config, pluginName);
  const destPath = path.resolve(this.path.base, this.path.root);
  const enableDebugging = this.mode.enableDebugging;
  const pluginDirname = __dirname;
  const sourceFile = this[pluginName] && this[pluginName].sourceFile
    ? this[pluginName].sourceFile
    : 'hook-callback.js';
  return () => this.gulp.src([ path.resolve(pluginDirname, sourceFile) ])
    // 1st pass
    .pipe(through.obj((file, enc, callback) => {
      let script = String(file.contents);
      script = preprocess(script,
        {
          SPACE: ' ',
          EQUAL: '=',
          SEMICOLON: ';',
          enableDebugging: typeof enableDebugging === 'undefined' ? 'false' : enableDebugging,
        },
        {
          type: 'js',
          srcDir: pluginDirname, // in plugins/policy/
        }
      );
      script = script.replace(/\/\* #include /g, '/* @include ');
      file.contents = Buffer.from(script);
      callback(null, file);
    }))
    // 2nd pass
    .pipe(through.obj((file, enc, callback) => {
      let script = String(file.contents);
      script = preprocess(script,
        {
          SPACE: ' ',
          EQUAL: '=',
          SEMICOLON: ';',
        },
        {
          type: 'js',
          srcDir: configPath, // in demo-config/policy/
        }
      );
      file.contents = Buffer.from(script);
      callback(null, file);
    }))
    .pipe(this.gulp.dest(destPath));
}

module.exports = {
  init,
  configurator,
  name: pluginName,
  dependencies: [],
};
```

- Shortcut plugin exporting a task function directly
```js
const fs = require('fs');
module.exports = function cwd_plugin (done) { // Arrow functions are not supported
  // cwd is gurranteed to be this.path.base in overridden this.pre()
  console.log(cwd_plugin.name, this.path, JSON.parse(fs.readFileSync(`${this.path.config}/${cwd_plugin.name}/cwd_plugin-config.json`))['cwd_plugin-config']);
  done();
}
```

- Shortcut plugin exporting a task function with options
```js
const path = require('path');

const pluginName = 'shortcut-plugin-2';

module.exports = Object.assign(function shortcut_plugin2 (done) {
  console.log(pluginName, this.path, require(path.resolve(this.path.base, this.path.config, pluginName, 'shortcut-plugin-2-config.js'))['shortcut-plugin-2-config']);
  done();
}, {
  displayName: pluginName,
  dependencies: [ 'shortcut_plugin1' ],
});
```

# License

[BSD-2-Clause](https://github.com/t2ym/target-configurator/blob/master/LICENSE.md)
