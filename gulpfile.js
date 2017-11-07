var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    strip = require('gulp-strip-debug'),
    htm = require('gulp-htmlmin');


//Scripts Task
//Uglifies
gulp.task('scripts', function () {
    gulp.src('app/src/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(strip())
        .pipe(gulp.dest('app/dst/js'))
        .pipe(reload({stream: true}));
});

//styles task
gulp.task('styles', function () {
    return sass('app/src/stylesheets/*.scss', {style: 'compressed'})
        .pipe(plumber())
        .on('error', sass.logError)
        .pipe(gulp.dest('app/dst/stylesheets'))
        .pipe(reload({stream: true}));
});

//HTML Task
gulp.task('html', function () {
    gulp.src('app/src/*.htm')
        .pipe(htm({collapseWhitespace: true}))
        .pipe(gulp.dest('app/dst'))
        .pipe(reload({stream: true}));
});

//Browser-Sync Task
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./app/",
            index: "dst/index.htm"
        }
    });
});

//watch task
gulp.task('watch', function () {
    gulp.watch('app/src/js/*.js', ['scripts']);
    gulp.watch('app/src/stylesheets/*.scss', ['styles']);
    gulp.watch('app/src/*.htm', ['html']);
});

gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'watch']);