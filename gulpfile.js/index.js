'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const embedSVG = require('gulp-embed-svg');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const server = require('browser-sync').create();
const webpack = require('webpack-stream');


// Paths
const dirs = {
  pug: './src/pug/**/*.pug',
  scss: './src/scss/**/*.scss',
  styles: './src/scss/styles.scss',
  docs: './docs',
  svg: './src/img/**/*.svg',
  js: './src/js/**/*.js',
};


// Webpack config
const webpackConfig = {
  entry: {
    scripts: './src/js/scripts.js',
  },

  output: {
    filename: '[name].js',
  },

  mode: 'production',
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};


/**
 * Starts browser sync server
 */
const startServer = () => {
  server.init({
    server: {
      baseDir: dirs.docs,
    },
    port: 1337,
  });
};


/**
 * Reloads browser sync server
 */
const reloadServer = (cb) => {
  server.reload();
  cb();
}


/**
 * Renders pug to html
 */
const renderPug = () => gulp.src(dirs.pug)
  .pipe(pug())
  .pipe(embedSVG({
    root: './src/',
  }))
  .pipe(gulp.dest(dirs.docs));


/**
 * Compiles scss to css
 */
const compileSCSS = () => gulp.src(dirs.styles)
  .pipe(sass())
  .pipe(autoprefixer({
    overrideBrowserslist: [
      "last 2 versions",
      "> 0.5%",
      "maintained node versions",
      "not dead"
    ]
    // cascade: false,
  }))
  .pipe(gulp.dest(dirs.docs))
  .pipe(server.reload({stream: true}));


/**
 * Compiles js files
 */
const compileScripts = () => gulp.src(dirs.js)
  .pipe(webpack(webpackConfig))
  .pipe(gulp.dest(dirs.docs));


const watch = () => {
  startServer();
  gulp.watch(dirs.pug, gulp.series(renderPug, reloadServer));
  gulp.watch(dirs.svg, gulp.series(renderPug, reloadServer));
  gulp.watch(dirs.scss, gulp.series(compileSCSS));
  gulp.watch(dirs.js, gulp.series(compileScripts, reloadServer));
};


// Export functions to tasks
exports.renderPug = renderPug;
exports.styles = compileSCSS;
exports.scripts = compileScripts;

exports.watch = watch;
