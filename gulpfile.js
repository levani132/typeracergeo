var gulp = require('gulp');
var uglify = require('gulp-uglify-es').default;
var minifyCSS = require('gulp-csso');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('html', function(){
  return gulp.src('public/**/*.html')
    .pipe(gulp.dest('build/public'))
});

gulp.task('css', function(){
  return gulp.src('public/css/**/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/public/css'))
});

gulp.task('js', function(){
  return gulp.src(['public/js/**/*.js', '!public/js/base/**/*.js', '!public/js/*.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/public/js'))
});

gulp.task('core', function(){
  return gulp.src('public/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('core.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/public/js'))
});

gulp.task('base', function(){
  return gulp.src([
    'public/js/base/toastr.js',
    'public/js/base/header.js',
    'public/js/base/ranks.js',
    'public/js/base/service.js',
    'public/js/base/layout.js',
    'public/js/base/user.js',
    'public/js/base/site.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('base.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/public/js'))
});

gulp.task('clean map', [ 'html', 'css', 'js', 'fonts', 'img', 'core', 'base' ], function(){
  return gulp.src('build/public/**/*.js.map')
    .pipe(clean())
});

gulp.task('img', function(){
  return gulp.src('public/img/**/*.*')
    .pipe(gulp.dest('build/public/img'))
});

gulp.task('fonts', function(){
  return gulp.src('public/fonts/**/*.*')
    .pipe(gulp.dest('build/public/fonts'))
});

gulp.task('clean', function(){
  return gulp.src('build')
    .pipe(clean())
});

gulp.task('default', [ 'html', 'css', 'js', 'fonts', 'img', 'core', 'base', 'clean map' ]);
gulp.task('debug', [ 'html', 'css', 'js', 'fonts', 'img', 'core', 'base' ]);