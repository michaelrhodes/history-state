var raf = require('raf-component')
var emitter = require('emitter-component')
var listener = require('eventlistener')

var history = window.history
var location = window.location
var pushState = history.pushState
var hasPushState = !!pushState

var HistoryState = function(options) {
  if (!(this instanceof HistoryState)) {
    return new HistoryState(options)
  }

  var wantsPushState = options && options.pushState
  var wantsHash = options && options.hash

  this.usePushState = (
    wantsPushState ||
    (hasPushState && !wantsHash)
  )

  if (this.usePushState && !hasPushState && !wantsHash) {
    throw new Error(
      'This browser does not support history.pushState.'
    )
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

    this.usePushState ?
      listener.add(window, 'popstate', this.announce) :
      listener.add(window, 'hashchange', this.announce)

  }.bind(this))
}

HistoryState.prototype.stop = function() {
  this.usePushState ?
    listener.remove(window, 'popstate', this.announce) :
    listener.remove(window, 'hashchange', this.announce)
}

HistoryState.prototype.change = function(path) {
  var pathname = location.pathname
  var hash = location.hash
  var isHash = /^#/.test(path)
  var reload = (
    isHash ? path === hash :
    this.usePushState ? path === pathname + hash :
    path === hash.substr(1)
  )

  if (!reload) {
    this.set(path)
    return true
  }

  return false
}

HistoryState.prototype.set = function(path) {
  if (this.usePushState) {
    history.pushState(null, null, path)
    this.announce()
    return true
  }

  location.hash = path
  return true
}

module.exports = HistoryState
