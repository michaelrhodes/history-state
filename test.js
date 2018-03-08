var assert = require('assert')
var state = require('./')()

var count = 0
var first = '/first'
var second = '/second'
var expected = first

setTimeout(function () {
  state.onchange = function () {
    assert.equal(location.pathname, expected)

    if (++count === 2) {
      state.stop()
      state.replace('/')
    }
  }

  state.push(first)

  setTimeout(function () {
    expected = second
    state.replace(second)
  }, 1000)
}, 1000)
