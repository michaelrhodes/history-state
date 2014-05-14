var fs = require('fs')
var server = require('http').createServer
var ecstatic = require('ecstatic')({
  autoIndex: true,
  gzip: true,
  root: __dirname,
  showDir: false
})

// This is a temporary server that serves up 
// the static assets and the index.html page. 
// This lets us use history.pushState without
// getting 404s on refresh.

server(function(request, response) {
  ecstatic(request, response, function() {
    response.statusCode = 200
    fs.createReadStream(__dirname + '/index.html')
      .pipe(response)   
  })
})
.listen(process.argv[2] || 8000, function() {
  console.log(
    'Listening on ' +
    this.address().port
  )
})
