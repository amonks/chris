var gutil = require('gulp-util')
var path = require('path')
var through = require('through2')
var merge = require('deepmerge')

module.exports = function (options) {
  var data = []
  var first_file

  return through.obj(
    function (file, encoding, callback) {
      // we handle null files (that have no contents), but not dirs
      if (file.isDirectory()) {
        return callback(null, file)
      }
      data.push(merge({
        path: path.relative(
                path.join(process.cwd(), '../website'),
                file.path
              ),
        text: file.contents.toString()
      }, file.frontmatter))
      if (!first_file) {
        first_file = file
      }
      return callback()
    },
    function (callback) {
      this.push(new gutil.File({
        cwd: first_file.cwd,
        base: first_file.cwd,
        path: path.join(first_file.cwd, 'site.json'),
        contents: new Buffer(JSON.stringify(data), 'utf8')
      }))
      callback()
    }
  )
}

