import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();


function lint(files, options) {
  return () => {
	return gulp.src(files)
	  .pipe($.eslint.format())
	  .pipe($.eslint.failAfterError());
  };
}

gulp.task('lint', lint('./js/*.js'));

// babelize & move to root js folder
gulp.task('scripts', () => {
  return gulp.src('./js/*.js')
	.pipe($.plumber())
	.pipe($.babel({
            presets: ['es2015']
        }))
	.pipe(gulp.dest('../js/'))
});

gulp.task('build', ['lint', 'scripts'], () => {
	return gulp.src('../js/*.js')
	.pipe($.uglify())
	.pipe($.rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('../js/'))
});