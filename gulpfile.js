var gulp = require('gulp');
var concat = require('gulp-concat');
 
var path = 'app/js/';
var srcFiles = [path + 'midi.js',
				path + 'keyboard.js',
				path + 'analyser.js',
				path + 'services/amp.js',
				path + 'services/lfo-amp.js',
				path + 'services/osc.js',
				path + 'services/filter.js',
				path + 'services/lfo.js',
				path + 'audio.js',
				path + 'synth.js',
				path + 'app.js'];

gulp.task('default', function () {
  gulp.src(srcFiles)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js/'))
});