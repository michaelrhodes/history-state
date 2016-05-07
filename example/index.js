require('./function-prototype-bind')

var format = require('title-case')
var normalize = require('normalize-event')
var did = require('did-route')()
var state = require('../')()

var title = document.title
var heading = document.getElementById('heading')
var list = document.getElementById('list')

var update = function(name) {
  var page = format(name || '500')
  document.title = page + ' | ' + title
  heading.innerHTML = page
}

did.get('/', function() {
  update('homepage')
})

did.get('/:state([^#\/]+)', function(params) {
  update(params.state)
})

did.get('*#/:state([^#\/]+)', function(params) {
  update(params.state)
})

state.on('change', function() {
  if (!did.route(location, true)) {
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

function posthost(href) {
  return href.replace(/^.+:\/\/[^\/]+(.+)/, '$1')
}
