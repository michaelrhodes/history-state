require('../example/function-prototype-bind')

var test = require('tape')
var HistoryState = require('../')

test('it with pushState or hashchange', function (assert) {
  shared(assert)
})

test('it can just use hashchange', function (assert) {
  shared(assert, { hash: true })
})

test('it can just use pushState', function (assert) {
  var hasPushState = !!history.pushState
  try { 
    shared(assert, { pushState: true })
  }
  catch (e) {
    assert.notOk(hasPushState, e.message)
    assert.end()
  }
})

function posthost (href) {
  return href.replace(/^.+:\/\/[^\/]+(.+)/, '$1')
}

function hasTail (haystack, needle) {
  return haystack.lastIndexOf(needle) + needle.length === haystack.length
}

function shared (assert, options) {
  var count = 0

  var first = '/first'
  var second = '/second'
  var expected = first

  var state = new HistoryState(options)

  setTimeout(function () {
    state.on('change', function () {
      var current = posthost(location.href)
      var good = hasTail(current, expected)
      assert.ok(good, current)
      if (++count === 2) {
        state.off('change')
        state.stop()
        state.change('/')
        assert.end()
      }
    })

    state.change(first)

    setTimeout(function () {
      expected = second
      state.change(second)
    }, 1000)
  }, 1000)
}
