// setup globals for within tags
// what's the better way of getting this object into my weird requireless eval context?

var top_parent = function (el) {
  if (el.parent) {
    return top_parent(el.parent)
  }
  return el
}
GLOBAL.data = {
  init: function () {
    this.site = require('./build-tmp/site.json')
    this.page = this.top_parent().opts.page
  },
  top_parent: function () {
    return top_parent(this)
  }
}

