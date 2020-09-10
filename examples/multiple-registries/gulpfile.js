const gulp = require('gulp');
const stringify = require('json-stringify-safe');

const targetConfigA = require('./config-a/config.js');
gulp.registry(targetConfigA);
console.log('targetConfigA', stringify(targetConfigA, null, 2));

gulp.task('plugin-a1');

const targetConfigB = require('./config-b/config.js');
gulp.registry(targetConfigB);
console.log('targetConfigB', stringify(targetConfigB, null, 2));

gulp.task('plugin-b1');
gulp.task('plugin-b2');

const { targetConfigC1, targetConfigC2 } = require('./config-c/config.js');
gulp.registry(targetConfigC1);
console.log('targetConfigC1', stringify(targetConfigC1, null, 2));
gulp.task('@scoped/plugin-c1');

gulp.registry(targetConfigC2);
console.log('targetConfigC2', stringify(targetConfigC2, null, 2));
gulp.task('@scoped/plugin-c2');

const { targetConfigD } = require('./config-d/config.js');
gulp.registry(targetConfigD);
console.log('targetConfigD', stringify(targetConfigD, null, 2));
gulp.task('@scoped2');

const targetConfigE = require('./config-e/config.js');
gulp.registry(targetConfigE);
console.log('targetConfigE', stringify(targetConfigE, null, 2));

gulp.task('plugin-e1');
gulp.task('plugin-e2');

gulp.task('default', gulp.series('plugin-a1', 'plugin-b2', '@scoped/plugin-c2', '@scoped2', 'plugin-e2'));
