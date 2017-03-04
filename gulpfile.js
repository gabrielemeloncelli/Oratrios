var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
  gulp.src('dist/*.js')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api'));
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/app'));
  gulp.src('app/**/*.css')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/app'));
  gulp.src('node_modules/bootstrap/**/*.css')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/node_modules/bootstrap'));
  gulp.src('node_modules/bootstrap/**/*.woff2')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/node_modules/bootstrap'));
  gulp.src('node_modules/bootstrap/**/*.woff')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/node_modules/bootstrap'));
  gulp.src('node_modules/bootstrap/**/*.ttf')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/node_modules/bootstrap'));
});