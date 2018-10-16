const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat-util')
const clean = require('gulp-clean')
const print = require('gulp-print').default
const nodemon = require('gulp-nodemon')

gulp.task('devel', () => {
  nodemon({
      script: 'src/index.js',
      presets: ['env', 'stage-2'],
      exec: 'babel-node'
    })
    .on('restart', () => { console.log('>> node restart') })
})

gulp.task('clean', () =>
  gulp.src('dist/*').pipe(clean())
)

gulp.task('build', () =>
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(print())
    .pipe(concat.scripts('counter.js'))
    .pipe(gulp.dest('dist/'))
)

gulp.task('default', ['clean', 'build'])
