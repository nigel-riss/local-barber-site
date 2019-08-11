'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const embedSVG = require('gulp-embed-svg');
const sass = require('gulp-sass');
const server = require('browser-sync').create();


// Paths
const dirs = {
  pug: './src/pug/**/*.pug',
  scss: './src/scss/**/*.scss',
  styles: './src/scss/styles.scss',
  docs: './docs',
  svg: './src/img/**/*.svg',
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
  .pipe(gulp.dest(dirs.docs))
  .pipe(server.reload({stream: true}));


const watch = () => {
  startServer();
  gulp.watch(dirs.pug, gulp.series(renderPug, reloadServer));
  gulp.watch(dirs.svg, gulp.series(renderPug, reloadServer));
  gulp.watch(dirs.scss, gulp.series(compileSCSS));
};


// Export functions to tasks
exports.renderPug = renderPug;
exports.styles = compileSCSS;

exports.watch = watch;
