var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
  gulp.src('dist/*.js')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.0/Test/Oratrios/Oratrios.Api'));
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.0/Test/Oratrios/Oratrios.Api/app'));
  gulp.src('app/**/*.css')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.0/Test/Oratrios/Oratrios.Api/app'));
});