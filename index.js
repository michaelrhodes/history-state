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
  this.announce = this.emit.bind(this, 'change')
  this.start()
}

HistoryState.prototype = emitter.call({
  change: change,
  start: start,
  stop: stop
})

function start () {
  raf(function() {
    if (this.started) return
    this.started = true
    this.announce()

    this.usePushState ?
      window.addEventListener('popstate', this.announce, false) :
      this.hashwatch = hashwatch(this.announce)
  }.bind(this))
}

function stop () {
  this.usePushState ?
    window.removeEventListener('popstate', this.announce) :
    this.hashwatch.pause()
}

function change (path) {
  var pathname = location.pathname
  var hash = location.hash
  var isHash = /^#/.test(path)
  var reload = (
    isHash ? path === hash :
    this.usePushState ? path === pathname + hash :
    path === hash.substr(1)
  )

  return reload ? false : set.call(this, path), true
}

function set (path, silent) {
  if (!this.usePushState) {
    location.hash = path
    return true
  }

  history.pushState(null, null, path)
  this.announce()
  return true
}
