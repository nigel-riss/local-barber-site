'use strict';

const path          = require('path');
const gulp          = require('gulp');
const pug           = require('gulp-pug');
const embedSVG      = require('gulp-embed-svg');
const dartSass      = require('sass');
const gulpSass      = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const server        = require('browser-sync').create();
const webpack       = require('webpack-stream');


const sass = gulpSass(dartSass);


// Paths
const dirs = {
  pug:       './src/pug/**/*.pug',
  scss:      './src/scss/**/*.scss',
  styles:    './src/scss/styles.scss',
  docs:      './docs',
  svg:       './src/img/**/*.svg',
  js:        './src/js/**/*.js',
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
    // ui:false,
    // notify: false,
    server: {
      baseDir: dirs.docs,
    },
    port: 1337,
    // host: `192.168.88.66`,
    // tunnel: true,
    // browser: `firefox`,
    ghostMode: {
      clicks: false,
      forms: false,
      location: false,
      scroll: false,
    },
  });
};


// Render html from pug
const renderPug = () => gulp
  .src(dirs.pug)
  .pipe(pug({
    pretty: true,
    data: {},
    self: true,
  }))
  .on(`error`, (err) => {
    console.log("\x1b[31m", err.message, "\x1b[0m");
    this.emit(`end`);
  })
  .pipe(embedSVG({
    root: `./src/`,
  }))
  .on(`error`, (err) => {
    console.log("\x1b[31m", err.message, "\x1b[0m");
    this.emit(`end`);
  })
  .pipe(gulp.dest(dirs.docs))
  .pipe(server.stream());


/**
 * Compiles scss to css
 */
const compileSCSS = () => gulp
  .src(dirs.styles)
  .pipe(sass().on(`error`, sass.logError))
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
  .pipe(server.stream());


/**
 * Compiles js files
 */
const compileScripts = () => gulp
  .src(dirs.js)
  .pipe(webpack(webpackConfig)
    .on(`error`, (err) => {
      console.log("\x1b[31m", err.message, "\x1b[0m");
      this.emit(`end`);
    })
  )
  .pipe(gulp.dest(dirs.docs))
  .pipe(server.stream());


const watch = () => {
  startServer();
  gulp.watch(dirs.pug, gulp.series(renderPug));
  gulp.watch(dirs.svg, gulp.series(renderPug));
  gulp.watch(dirs.scss, gulp.series(compileSCSS));
  gulp.watch(dirs.js, gulp.series(compileScripts));
};


// Export functions to tasks
exports.renderPug = renderPug;
exports.styles = compileSCSS;
exports.scripts = compileScripts;

exports.watch = watch;
