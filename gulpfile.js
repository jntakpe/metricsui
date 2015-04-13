"use strict";

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    prefix = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml= require('gulp-minify-html'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    flatten = require('gulp-flatten'),
    rev = require('gulp-rev'),
    fs = require('fs'),
    xml2Js = require('xml2js'),
    del = require('del'),
    wiredep = require('wiredep'),
    runSequence = require('run-sequence'),
    dirs = {
        web: 'src/main/webapp',
        source: 'src/main/webapp/static',
        bower: 'src/main/webapp/static/bower_components',
        dest: 'src/main/webapp/dist',
        tmp: 'src/main/webapp/dist/tmp'
    };

gulp.task('build', function () {
    runSequence('clean', 'copy', 'wiredep', 'usemin');
});

gulp.task('clean', function (cb) {
    del([dirs.dest], cb);
});

gulp.task('clean:tmp', function (cb) {
    del([dirs.tmp], cb);
});

gulp.task('copy', function () {
    gulp.src(dirs.bower + '/**/*.{ttf,woff,eof}')
        .pipe(flatten())
        .pipe(gulp.dest(dirs.dest + '/fonts'));
});

gulp.task('usemin', function () {
    return gulp.src([dirs.web + '**/*.html', '!' + dirs.bower + '/**/*.html'])
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('build/'));
});
gulp.task('wiredep', function () {
    gulp.src('src/main/webapp/index.html')
        .pipe(wiredep.stream({exclude: [/swagger-ui/]}))
        .pipe(gulp.dest('src/main/webapp'));
});

function parsePomVersion() {
    var version, pom = fs.readFileSync('pom.xml', 'utf8');
    xml2Js.parseString(pom, function (err, result) {
        version = result.project.version[0];
    });
    return version;
}
