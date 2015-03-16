var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var srcPath = './src/**/*.js';

gulp.task('lint', function () {
  return gulp.src(srcPath)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function () {
  gulp.watch(srcPath, ['build']);
});

gulp.task('build', ['lint'], function () {
  // copy original files
  gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist'));

  // create minified files
  gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build', 'watch']);