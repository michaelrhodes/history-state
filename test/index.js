require('../example/function-prototype-bind')

var run = require('tape')
var concat = require('concat-regexp')
var state = require('../')()
var posthost = function(href) {
  return href.replace(/^.+:\/\/[^\/]+(.+)/, '$1')
}

run('it works', function(test) {
  test.plan(3)

  var first = '/first'
  var second = '/second'
  var expected = ''

  state.on('change', function() {
    var current = posthost(location.href)
    var pattern = concat(expected, '$')
    test.ok(pattern.test(current), current)
  })

  expected = first
  state.change(first)

  setTimeout(function() {
    expected = second
    state.change(second)

    setTimeout(function() {
      expected = first
      history.back()
    }, 0)
  }, 0)
})
