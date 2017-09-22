var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber');


//Scripts Task
//Uglifies
gulp.task('scripts', function () {
    gulp.src('js/src/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('js/dst'))
});

//styles task
gulp.task('styles', function () {
    return sass('css/src/*.scss', {style: 'compressed'})
        .pipe(plumber())
        .on('error', sass.logError)
        .pipe(gulp.dest('css/dst'))
        .pipe(reload({stream: true}));
});

//HTML Task
gulp.task('html', function () {
    gulp.src('*.htm');
});

//Browser-Sync Task
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "jsninjaproject",
            index: "index.htm"
        }
    });
});

//watch task
gulp.task('watch', function () {
    gulp.watch('js/src/*.js', ['scripts']);
    gulp.watch('css/src/*.scss', ['styles']);
    gulp.watch('*.htm', ['html']);
});

gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'watch']);