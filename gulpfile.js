var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber');


//Scripts Task
//Uglifies
gulp.task('scripts', function () {
    gulp.src('app/js/src/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('app/js/dst'))
        .pipe(reload({stream: true}));
});

//styles task
gulp.task('styles', function () {
    return sass('app/css/src/*.scss', {style: 'compressed'})
        .pipe(plumber())
        .on('error', sass.logError)
        .pipe(gulp.dest('app/css/dst'))
        .pipe(reload({stream: true}));
});

//HTML Task
gulp.task('html', function () {
    gulp.src('app/*.htm')
        .pipe(reload({stream: true}));
});

//Browser-Sync Task
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./app/",
            index: "index.htm"
        }
    });
});

//watch task
gulp.task('watch', function () {
    gulp.watch('app/js/src/*.js', ['scripts']);
    gulp.watch('app/css/src/*.scss', ['styles']);
    gulp.watch('app/**/*.htm', ['html']);
});

gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'watch']);