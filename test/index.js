require('../example/function-prototype-bind')

var run = require('tape')
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
    var good = (
      current.lastIndexOf(expected) + expected.length ===
      current.length
    )
    test.ok(good, current)
  })

  setTimeout(function() {
    expected = first
    state.change(first)

    setTimeout(function() {
      expected = second
      state.change(second)

      setTimeout(function() {
        expected = first
        history.back()
      }, 100)
    }, 100)
  }, 100)
})
