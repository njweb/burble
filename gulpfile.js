'use strict';
let gulp = require('gulp');
let uglify = require('gulp-uglify');
let streamify = require('gulp-streamify');
let rollup = require('rollup-stream');
let babel = require('rollup-plugin-babel');
let replace = require('rollup-plugin-replace');
let babelRegister = require('babel-register');
let source = require('vinyl-source-stream');

let jest = require('jest');

let pkg = require('./package.json');

gulp.task('build_lib', function () {
  return rollup({
    entry: './src/index.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'burble',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        exclude: 'node_modules/**',
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      })
    ]
  }).pipe(source(pkg.name + '.js'))
    .pipe(gulp.dest('./lib'));
});

gulp.task('build_module_lib', function () {
  return rollup({
    entry: './src/index.js',
    format: 'es',
    exports: 'named',
    moduleName: 'burble',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }).pipe(source(pkg.name + '.esm.js'))
    .pipe(gulp.dest('./lib'));
});

gulp.task('build_min_lib', function () {
  return rollup({
    entry: './src/index.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'burble',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      replace({
        exclude: 'node_modules/**',
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      })
    ]
  }).pipe(source(pkg.name + '.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./lib'));
});

gulp.task('spec', function (done) {
  process.env.BABEL_ENV = 'test';
  jest.runCLI({
    config: {verbose: true},
    onlyChanged: false,
    testFileExtensions: ["js"],
    moduleFileExtensions: ["js", "jsx", "json"]
  }, './spec', () => { done(); });
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['spec']);
  gulp.watch('./spec/*.js', ['spec']);
});

gulp.task('default', ['build_lib', 'build_module_lib', 'build_min_lib'], function () {});