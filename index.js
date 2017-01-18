var raf = require('rafl')
var emitter = require('mittens')
var hashwatch = require('hashwatch')

var history = window.history
var location = window.location
var pushState = history.pushState
var hasPushState = !!pushState

module.exports = HistoryState

function HistoryState (opts) {
  if (!(this instanceof HistoryState)) {
    return new HistoryState(opts)
  }

  var wantsPushState = opts && opts.pushState
  var wantsHash = opts && opts.hash

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
  this.announce = beforeChange.call(this, opts && opts.beforeChange)
  this.start()
}

emitter.call(HistoryState.prototype)

HistoryState.prototype.start = function() {
  raf(function() {
    if (this.started) return
    this.started = true
    this.announce()

    this.usePushState ?
      window.addEventListener('popstate', this.announce, false) :
      this.hashwatch = hashwatch(this.announce)
  }.bind(this))
}

HistoryState.prototype.stop = function() {
  this.usePushState ?
    window.removeEventListener('popstate', this.announce) :
    this.hashwatch.pause()
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

  return reload ? false : this.set(path), true
}

HistoryState.prototype.set = function(path, silent) {
  if (!this.usePushState) {
    location.hash = path
    return true
  }

  history.pushState(null, null, path)
  this.announce()
  return true
}

function beforeChange (fn) {
  var emit = this.emit.bind(this, 'change')
  return typeof fn == 'function' ? maybeEmit : emit

  function maybeEmit () {
    if (fn.apply(null, arguments) !== false) emit()
  }
}
