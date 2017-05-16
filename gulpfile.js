var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
  gulp.src('dist/*.js')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api'));
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/app'));
  gulp.src('app/**/*.css')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/app'));
  gulp.src('assets/**/*.*')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/assets'));
  gulp.src('node_modules/bootstrap/dist/**/*.css')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/node_modules/bootstrap/dist'));
  gulp.src('node_modules/bootstrap/dist/**/*.woff2')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/node_modules/bootstrap/dist'));
  gulp.src('node_modules/bootstrap/dist/**/*.woff')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/node_modules/bootstrap/dist'));
  gulp.src('node_modules/bootstrap/dist/**/*.ttf')
  .pipe(gulp.dest('C:/Collection 2016/Oratrios/v1.1/Test/Oratrios.Api/node_modules/bootstrap/dist'));

});