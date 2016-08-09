'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var autoprefixer = require('gulp-autoprefixer');



gulp.task('watch', function(){
	gulp.watch('./dev/styles/**/*.scss', ['styles'])
});

gulp.task('styles', function(){
	return gulp.src('./dev/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles/'))
		// .pipe(reload({stream: true}));

});

gulp.task('default', ['styles','watch']);