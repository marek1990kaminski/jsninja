var gulp = require('gulp'),
    uglify = require('gulp-uglify');


gulp.task('default', function () {
    gulp.src('js/src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('js/dst'));
});