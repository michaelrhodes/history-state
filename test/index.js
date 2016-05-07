require('../example/function-prototype-bind')

var run = require('tape')
var HistoryState = require('../')
var posthost = function(href) {
  return href.replace(/^.+:\/\/[^\/]+(.+)/, '$1')
}

var hasTail = function(haystack, needle) {
  return haystack.lastIndexOf(needle) + needle.length === haystack.length
}

var shared = function(test, options) {
  var count = 0

  var first = '/first'
  var second = '/second'
  var expected = first

  var state = new HistoryState(options)

  setTimeout(function() {
    state.on('change', function() {
      var current = posthost(location.href)
      var good = hasTail(current, expected)
      test.ok(good, current)
      if (++count === 2) {
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
    }, 1000)
  }, 1000)
}

run('it with pushState or hashchange', function(test) {
  shared(test)
})

run('it can just use hashchange', function(test) {
  shared(test, { hash: true })
})

run('it can just use pushState', function(test) {
  var hasPushState = !!history.pushState
  try { 
    shared(test, { pushState: true })
  }
  catch (e) {
    test.notOk(hasPushState, e.message)
    test.end()
  }
})
