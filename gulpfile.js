const gulp = require('gulp');
const ect = require('gulp-ect');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const webserver = require('gulp-webserver');

const config = require('config');
const data = require('./assets/data.json');
const stats = require('./assets/stats.json');

gulp.task('test', function(){
  console.log(data);
});

gulp.task('html', function(){
  gulp.src('./src/*.ect')
      .pipe(ect({data: function(file, cb){
        cb({
          data: data,
          stats: stats
        });
      }}))
      .pipe(gulp.dest('./public'));
});

gulp.task('js', function(){
  gulp.src('./src/js/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./public/js'));
});

gulp.task('css', function(){
  gulp.src('./src/css/*.scss')
      .pipe(sass({
        includePaths: ["node_modules/bootstrap-sass/assets/stylesheets"]
      }).on('error', sass.logError))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('assets', function(){
  gulp.src('./assets/*')
      .pipe(gulp.dest('./public/assets'));
});

gulp.task('webserver', function(){
  gulp.src('./public')
      .pipe(webserver({
          host: '0.0.0.0',
          port: config.port
        }));
});

gulp.task('watch', function(){
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./src/css/*.scss', ['css']);
  gulp.watch('./src/*.ect', ['html']);
});

gulp.task('start', ['webserver']);
gulp.task('build', ['html', 'js', 'css', 'assets']);
gulp.task('dev', ['build', 'watch', 'start']);
gulp.task('default', ['test', 'html', 'js', 'css', 'watch']);
