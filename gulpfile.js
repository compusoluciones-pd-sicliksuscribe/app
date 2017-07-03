var gulp = require('gulp');
var concat = require('gulp-concat');
var compressor = require('gulp-compressor');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      open: 'external',
      proxy: 'localhost:80'
    }, notify: false
  });
});

gulp.task('html', function () {
  return gulp
    .src('./app/**/**/*.html')
   // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./marketplace-app-min/app'));
});

gulp.task('compress', function () {
  return gulp
    .src('./app/**/**/*.js')
    .pipe(concat('all.js'))
    // .pipe(compressor({
    //   'executeOption': {
    //     maxBuffer: 10000 * 1024
    //   }
    // }))
    .pipe(gulp.dest('./marketplace-app-min/app'));
});

gulp.task('sass', function () {
  return gulp
    // Find all `.scss` files from the `stylesheets/` folder
    .src('./styles/**/*.scss')
    // Run Sass on those files
    .pipe(sass())
    // Write the resulting CSS in the output folder
    .pipe(gulp.dest('./marketplace-app-min/styles'))
    .pipe(notify({ message: 'Finished minifying sass' }));
});

gulp.task('scss', function () {
  return gulp
    // Find all `.scss` files from the `stylesheets/` folder
    .src('./styles/sass/*.scss')
    // Run Sass on those files
    .pipe(sass())
    .pipe(compressor())
    // Write the resulting CSS in the output folder
    .pipe(gulp.dest('./styles/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch_css', function () {
  return gulp
    .watch('./styles/sass/*.scss', ['scss'])
    .on('change', function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('watch_js', function () {
  return gulp
    .watch('./app/**/**/*.js', ['compress'])
    .on('change', function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('watch_html', function () {
  return gulp
    .watch('./app/**/**/*.html', ['html'])
    .on('change', function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['compress']);

/* Correr en este orden:
1. gulp html
2. gulp compress
3. gulp scss
4. gulp sass

usando el comando "gulp compress & gulp scss & gulp html"
o el comando "npm run min".

*/
