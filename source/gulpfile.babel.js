import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();


gulp.task('scripts', () => {
  return gulp.src('./source/*.js')
	.pipe($.plumber())
	.pipe($.babel({
            presets: ['es2015']
        }))
	.pipe(gulp.dest('./js'))
});

gulp.task('build', ['scripts'], () => {
	return gulp.src('./js/*.js')
	.pipe($.uglify())
	.pipe($.rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('./js/'))
});