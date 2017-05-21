import gulp from 'gulp';
import babel from 'gulp-babel';

gulp.task('es6-transpile', () => {
  gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('lib'));
})

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', ['es6-transpile']);
})

gulp.task('default', ['es6-transpile', 'watch']);
