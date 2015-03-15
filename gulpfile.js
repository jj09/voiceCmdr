var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
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
  gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build', 'watch']);