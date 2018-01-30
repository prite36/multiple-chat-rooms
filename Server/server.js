var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var server = require('http').Server(app)
var io = require('socket.io')(server)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('dist'))
io.on('connection', function (socket) {
  socket.on('start', function (data) {
    console.log(data)
  })
  socket.on('setName', function (data) {
    console.log(data)
    socket.broadcast.to(data.room).emit('getName', {
      name: data.name
    })
  })
})
app.set('port', (process.env.PORT || 3000))
server.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env)
})
