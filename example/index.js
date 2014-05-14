var format = require('title-case')
var concat = require('concat-regexp')
var normalize = require('normalize-event')
var can = require('can-route')()
var state = window.state = require('../')()

var posthost = function(href) {
  return href.replace(/^.+:\/\/[^\/]+(.+)/, '$1')
}

var title = document.title
var heading = document.querySelector('h1')
var list = document.querySelector('.pages')

var update = function(name) {
  var page = format(name || '500')
  document.title = page + ' | ' + title
  heading.innerHTML = page
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

list.onclick = function(e) {
  e = normalize(e)
  if (e.target.href) {
    e.preventDefault()
    state.change(posthost(e.target.getAttribute('href')))
  }
}
