var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

gulp.task('browserify', function(){
  var b = browserify({
    entries: ['./src/app.jsx'],
    transform: [reactify]
  });
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dest'));
});

gulp.task('watch', function(){
  // watch for compile
  gulp.watch(['src/app.jsx'], ['browserify']);
});