var raf = require('raf-component')
var emitter = require('emitter-component')
var listener = require('eventlistener')

var history = window.history
var location = window.location
var pushState = history.pushState
var hasPushState = !!pushState
var set = (function() {
  if (hasPushState) {
    return function(path) {
      history.pushState(null, null, path)
      return true
    }
  }

  return function(hash) {
    location.hash = hash
    return true
  }
})()

var HistoryState = function(options) {
  if (!(this instanceof HistoryState)) {
    return new HistoryState
  }

  this.started = false
  this.start = this.start.bind(this)
  this.announce = this.emit.bind(this, 'change')

  this.start()
}

emitter(HistoryState.prototype)

HistoryState.prototype.start = function() {
  raf(function() {
    if (this.started) {
      return
    }

    this.started = true
    this.announce()

    hasPushState ?
      listener.add(window, 'popstate', this.announce) :
      listener.add(window, 'hashchange', this.announce)

  }.bind(this))
}

HistoryState.prototype.stop = function() {
  hasPushState ?
    listener.remove(window, 'popstate', this.announce) :
    listener.remove(window, 'hashchange', this.announce)
}

HistoryState.prototype.change = function(path) {
  var isHash = /^#/.test(path)
  var reload = (
    isHash ?
      path === location.hash :
    hasPushState ?
      path === location.pathname + location.hash :
    path === location.hash.substr(1)
  )

  if (!reload) {
    set(path) && this.announce()
    return true
  }

  return false
}

module.exports = HistoryState
