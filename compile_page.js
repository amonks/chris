var riot = require('riot')

module.exports = function (file, encoding, callback) {
  // riot doesn't support doctype declarations
  var html = file.contents.toString().replace(/\<\!DOCTYPE.+\>/g, '')

  require('./build-tmp/all.tag')

  // not ideal.
  // TODO: submit an issue with riot or figure out require('vm')
  eval(riot.compile(html))

  var r = '<!DOCTYPE html>' + riot.render('html', {
    page: file.frontmatter
  })
  file.contents = new Buffer(r, 'utf8')
  return callback(null, file)
}

