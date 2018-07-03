var gulp = require('gulp');
var uglify = require('gulp-uglify-es').default;
var minifyCSS = require('gulp-csso');
var clean = require('gulp-clean');

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
  return gulp.src('public/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/public/js'))
});

gulp.task('clean', function(){
  return gulp.src('build')
    .pipe(clean())
});

gulp.task('default', [ 'html', 'css', 'js' ]);