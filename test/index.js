require('../example/function-prototype-bind')

var run = require('tape')
var HistoryState = require('../')

run('it with pushState or hashchange', function(test) {
  shared(test)
})

run('it can just use hashchange', function(test) {
  shared(test, { hash: true })
})

run('it can prevent change events from firing', function(test) {
  var count = 0

  var first = '/first'
  var second = '/second'
  var expected = second

  var state = new HistoryState({
    beforeChange: function () {
      var current = posthost(location.href)
      var isFirst = hasTail(current, '/first')
      if (isFirst) return false
    }
  })

  setTimeout(function() {
    state.on('change', function() {
      var current = posthost(location.href)
      var good = hasTail(current, expected)
      test.ok(good, current)
      if (++count === 1) {
        state.off('change')
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

function posthost(href) {
  return href.replace(/^.+:\/\/[^\/]+(.+)/, '$1')
}

function hasTail(haystack, needle) {
  return haystack.lastIndexOf(needle) + needle.length === haystack.length
}

function shared(test, options) {
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
        state.off('change')
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
