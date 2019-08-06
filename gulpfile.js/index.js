'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const server = require('browser-sync').create();


// Paths
const dirs = {
  pug: './src/pug/**/*.pug',
  docs: './docs',
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
  .pipe(gulp.dest(dirs.docs));


const watch = () => {
  startServer();
  gulp.watch(dirs.pug, gulp.series(renderPug, reloadServer));
};

// Export functions to tasks
exports.renderPug = renderPug;

exports.watch = watch;
