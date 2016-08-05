var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./public/src/css/base.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/dist/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./public/**/*.scss', ['sass']);
});