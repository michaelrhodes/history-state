module.exports = HistoryState

function HistoryState (onchange) {
  if (!(this instanceof HistoryState))
    return new HistoryState(onchange)

  this.onchange = onchange || noop
  this.listening = false
  this.start()
}

;(function () {
  this.stop = stop
  this.start = start
  this.push = push
  this.replace = replace
  this.handleEvent = handleEvent
}).call(HistoryState.prototype)

function start () {
  if (this.listening) return
  this.listening = true
  addEventListener('popstate', this)
}

function stop () {
  this.listening = false
  removeEventListener('popstate', this)
}

function push (path) {
  change.call(this, path)
}

function replace (path) {
  change.call(this, path, true)
}

function handleEvent (e) {
  this.onchange()
}

function change (path, silent) {
  var pathname = location.pathname
  var hash = location.hash.replace(/#$/, '')
  var changed = path[0] !== '#' ?
    path !== pathname + hash :
    path !== hash

  return changed && set.call(this, path, silent)
}

function set (path, silent) {
  var action = silent ? 'replace' : 'push'
  history[action + 'State'](null, null, path)
  if (this.listening) this.onchange()
  return true
}

function noop () {}
