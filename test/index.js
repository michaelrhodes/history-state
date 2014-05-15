require('../example/function-prototype-bind')

var run = require('tape')
var HistoryState = require('../')
var posthost = function(href) {
  return href.replace(/^.+:\/\/[^\/]+(.+)/, '$1')
}

var hasTail = function(haystack, needle) {
  return haystack.lastIndexOf(needle) + needle.length === haystack.length
}

var shared = function(test, hash) {
  var count = 0

  var first = '/first'
  var second = '/second'
  var expected = first

  var state = new HistoryState(hash)

  setTimeout(function() {
    state.on('change', function() {
      var current = posthost(location.href)
      var good = hasTail(current, expected)
      test.ok(good, current)
      if (++count === 3) {
        state.off() 
        state.stop()
        state.change('/')
        test.end()
      }
    })

    state.change(first)

    setTimeout(function() {
      expected = second
      state.change(second)

      setTimeout(function() {
        expected = first
        history.back()
      }, 1000)
    }, 1000)
  }, 1000)
}

run('it with pushState or hashchange', function(test) {
  shared(test)
})

run('it can just use hashchange', function(test) {
  shared(test, true)
})
