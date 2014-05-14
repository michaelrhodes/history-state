var run = require('tape')
var concat = require('concat-regexp')
var state = require('../')()

var posthost = function(href) {
  return href.replace(/^.+:\/\/[^\/]+(.+)/, '$1')
}

run('it works', function(test) {
  var path = '/testing-testing-123'

  state.once('change', function() {
    var current = posthost(location.href)
    var pattern = concat(path, '$')
    test.ok(pattern.test(current), current)
    test.end()
  })

  state.change(path)
})
