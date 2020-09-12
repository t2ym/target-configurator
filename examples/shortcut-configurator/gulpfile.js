const gulp = require('gulp');
const stringify = require('json-stringify-safe');

const targetConfig1 = require('./config-1/config.js');
gulp.registry(targetConfig1);
console.log('targetConfig1', stringify(targetConfig1, null, 2));

gulp.task('shortcut_plugin1');
gulp.task('shortcut-plugin-2');
gulp.task('cwd_plugin');
//process.chdir('..'); // This violates the assumption in targetConfig1.pre()

gulp.task('default', gulp.series('shortcut_plugin1', 'shortcut-plugin-2', 'cwd_plugin'));
