const gulp = require('gulp');
const sass = require('gulp-sass');
const webserver = require('browser-sync');
const pug = require('gulp-pug');
const cleanCss = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const del = require('del');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');
const include = require('gulp-include');
const concat = require('gulp-concat');
const svgSprite = require('gulp-svg-sprite');

// Clean task
gulp.task('clean', function () {
    return del(['prod']);
});

gulp.task('pug:build', function () {
    return gulp.src('./dev/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
            baseDir: __dirname
        }))
        .pipe(gulp.dest('./prod'));
});

gulp.task('vendor:js', function () {
    return gulp.src([
        './node_modules/bootstrap/dist/js/bootstrap.min.*',
        './node_modules/jquery/dist/jquery.min.*',
        './node_modules/popper.js/dist/umd/popper.min.*'
    ])
        .pipe(gulp.dest('./dev/js/vendor'));
});
gulp.task('sass', gulp.series(function compoleSass() {
    return gulp.src('./dev/sass/*.sass')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dev/css'));
}));
gulp.task('fonts:build', function () {
    return gulp.src('./dev/fonts/**/*')
        .pipe(gulp.dest('./prod/fonts'));
});
gulp.task('css:minify', gulp.series('sass', function cssMinify() {
    return gulp.src("./dev/css/main.css")
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./prod/css'))
        .pipe(browserSync.stream());
}));

gulp.task('vendor:build', function () {
    return gulp.src([
        './dev/js/vendor/jquery.min.js',
        './dev/js/vendor/popper.min.js',
        './dev/js/vendor/bootstrap.min.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./prod/js'))
        .pipe(browserSync.stream());
});
gulp.task('partsjs:build', function () {
    return gulp.src([
        './dev/js/parts/**/*.js'
    ])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./prod/js/parts'))
        .pipe(browserSync.stream());
});
gulp.task('images:build', function () {
    return gulp.src(['./dev/img/*', './dev/img/**/*'])
        .pipe(gulp.dest('./prod/img'));
});
gulp.task('js:minify', function () {
    return gulp.src([
        './dev/js/main.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            'suffix': '.min'
        }))
        .pipe(gulp.dest('./prod/js'))
        .pipe(browserSync.stream())
});

gulp.task('dev', gulp.series(['css:minify', 'js:minify', 'vendor:js', 'vendor:build', 'partsjs:build', 'pug:build'], function browserDev(done) {
    browserSync.init({
        server: './prod'
    });
    gulp.watch(['dev/sass/*.sass', 'dev/sass/**/*.sass', '!dev/sass/bootstrap/**'], gulp.series('css:minify', function cssBrowserReload(done) {
        browserSync.reload();
        done();
    }));
    gulp.watch(['dev/js/main.js'], gulp.series('js:minify', function jsBrowserReload(done) {
        browserSync.reload();
        done();
    }));
    gulp.watch(['dev/js/vendor.js'], gulp.series(['vendor:js', 'vendor:build'], function jsBrowserReload(done) {
        browserSync.reload();
        done();
    }));
    gulp.watch(['dev/*.pug', 'dev/modules/**/*.pug'], gulp.series('pug:build', function pugBrowserReload(done) {
        browserSync.reload();
        done();
    }));
    gulp.watch(['dev/js/parts/**/*.js'], gulp.series('partsjs:build', function partJsBrowserReload(done) {
        browserSync.reload();
        done();
    }));
    done();
}));
