var gulp = require('gulp');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var replace = require('gulp-replace-task');
var args = require('yargs').argv;
var fs = require('fs');

gulp.task('lint ', function() {
  return gulp.src(['src/buy-side/**/*.js', 'src/common/**/*.js', 'src/landing/**/*.js', 'src/sell-side/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('build/'))
});

gulp.task('process-js', function () {
  // Get the environment from the command line
  var env = args.env || 'remotedev';

  // Read the settings from the right file
  var filename = env + '.json';
  var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));

  // Replace each placeholder with the correct value for the variable.
  gulp.src('src/**/*.js')
    .pipe(replace({
      patterns: [
        {
          match: 'apiUrl',
          replacement: settings.apiUrl
        }
      ]
    }))
    .pipe(gulp.dest('build/'));
  }
);


gulp.task('process-html', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build/'))
});

gulp.task('process-scss', function() {
  return gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/'))
});

gulp.task('process-css', function() {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('build/'))
});

gulp.task('process-jpg', function() {
  return gulp.src('src/**/*.jpg')
    .pipe(gulp.dest('build/'))
});

gulp.task('process-png', function() {
  return gulp.src('src/**/*.png')
    .pipe(gulp.dest('build/'))
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['process-js']);
  gulp.watch('src/**/*.html', ['process-html']);
  gulp.watch('src/**/*.scss', ['process-scss']);
  gulp.watch('src/**/*.css', ['process-css']);
  gulp.watch('src/**/*.jpg', ['process-jpg']);
  gulp.watch('src/**/*.png', ['process-png']);
});

gulp.task('connect', function () {
  connect.server({
    root: 'build/',
    port: process.env.PORT || 8000,
    // port: args.port || 8000
  });
});

gulp.task('default', ['process-js', 'process-html', 'process-scss', 'process-css', 'process-jpg', 'process-png', 'watch', 'connect']);
