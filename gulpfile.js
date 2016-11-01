const gulp = require('gulp');
const ect = require('gulp-ect');
const babel = require('gulp-babel');
const data = require('./server/data.json');

gulp.task('test', function(){
  console.log(data);
});

gulp.task('html', function(){
  gulp.src('./src/*.ect')
      .pipe(ect({data: function(file, cb){
        cb({data: data});
      }}))
      .pipe(gulp.dest('./public'));
});

gulp.task('js', function(){
  gulp.src('./src/js/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./public/js'));
});

gulp.task('css', function(){
  gulp.src('./src/css/*.css')
      .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function(){
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./src/css/*.css', ['css']);
  gulp.watch('./src/*.ect', ['html']);
});

gulp.task('default', ['test', 'html', 'js', 'css', 'watch']);
