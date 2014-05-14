var format = require('title-case')
var concat = require('concat-regexp')
var can = require('can-route')()
var state = window.state = require('../')()

var title = document.title
var update = function(name) {
  var page = format(name || '500')
  document.title = page + ' | ' + title
}

var alpha = /(:<anchor>^|#)/
var omega = /\/?$/
var route = {
  home: concat(alpha, omega),
  name: concat(alpha, /\/(:<state>[^#\/]+)(:<hash>#.*)?/, omega)
}

can.get(route.name, function(params) {
  update(params.state)
})

can.get(route.home, function() {
  update('homepage')
})

state.on('change', function() {
  if (!can.route(location, true)) {
    update('404')
  }
})

document.querySelector('.pages').onclick = function(e) {
  if (e.target.href) {
    e.preventDefault()
    state.change(e.target.href)
  }
}
