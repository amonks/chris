var gulp = require('gulp')
var s3 = require('gulp-s3')
var through = require('through2')
var serve = require('gulp-serve')
var livereload = require('gulp-livereload')
var riot = require('riot')
var frontmatter = require('gulp-front-matter')
var zip = require('gulp-zip')
var data = require('./data.js')
var compile_page = require('./compile_page.js')
var cat = require('gulp-concat')
var clean = require('gulp-clean')
var prettify = require('gulp-prettify')
require('./tag_globals.js')

// allow to require('some.tag')
require.extensions['.tag'] = function (module, filename) {
  var src = riot.compile(require('fs').readFileSync(filename, 'utf8'))
  module._compile(
    'var riot = require(process.env.RIOT || "riot/riot.js"); module.exports =' + src
  , filename)
}

// gulp tasks

gulp.task('clean', function () {
  return gulp.src(['./build-tmp', '../build'])
    .pipe(clean({force: true}))
})

gulp.task('data', ['clean', 'pub'], function () {
  return gulp.src('../website/**/*')
    .pipe(frontmatter({
      property: 'frontmatter',
      remove: true
    }))
    .pipe(data())
    .pipe(gulp.dest('./build-tmp/'))
})

gulp.task('concat_tags', ['clean'], function () {
  return gulp.src(['../tags/**/*.tag'])
    .pipe(cat('all.tag'))
    .pipe(gulp.dest('./build-tmp/'))
})

gulp.task('riot', ['clean', 'data', 'concat_tags'], function () {
  return gulp.src('../website/**/*.html')
    .pipe(frontmatter({
      property: 'frontmatter',
      remove: true
    }))
    .pipe(through.obj(compile_page))
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest('../build'))
    .pipe(livereload())
})

gulp.task('watch', ['build'], function () {
  livereload.listen()
  var p = ['../tags/**/*', '../website/**/*']
  gulp.watch(p, ['build'])
})

gulp.task('pub', ['clean'], function () {
  return gulp.src(['../website/**/*', '!../**/*.html'])
    .pipe(gulp.dest('../build'))
})

gulp.task('build', ['riot', 'pub'], function () {
  return gulp.src(['./build-tmp'])
    .pipe(clean({force: true}))
})

gulp.task('zip', function () {
  return gulp.src(['./**/*', '!aws.json', '!xenakis.zip'])
    .pipe(zip('xenakis.zip'))
    .pipe(gulp.dest('./'))
})

gulp.task('release', ['zip'], function () {
  return gulp.src('./xenakis.zip')
    .pipe(s3(require('./aws.json')))
})

gulp.task('serve', ['watch'], serve('../build'))

gulp.task('default', ['build'])

