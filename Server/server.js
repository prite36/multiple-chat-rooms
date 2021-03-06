var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(express.static('dist'))
var usernames = {}
var countPeople = {room1: 0, room2: 0, room3: 0}
io.sockets.on('connection', socket => {
  io.sockets.emit('updateusers', countPeople)
  socket.on('connectFirstTime', data => {
    console.log(`User ${data.userName} Connection`)
    socket.username = data.userName
    socket.room = data.room
    usernames[data.userName] = data.userName
    socket.join(data.room)
    countPeople[socket.room] ++
    io.sockets.emit('updateusers', countPeople)
    socket.emit('updatechat', {userName: 'SERVER', data: `you have connected to ${data.room}`})
    socket.broadcast.to(data.room).emit('updatechat', {userName: 'SERVER', data: `${data.userName} has connected to this room`})
  })
  socket.on('switchRoom', newroom => {
    socket.leave(socket.room)
    countPeople[socket.room] --
    socket.join(newroom)
    countPeople[newroom] ++
    io.sockets.emit('updateusers', countPeople)
    socket.emit('updatechat', {userName: 'SERVER', data: `you have connected to ${newroom}`})
    socket.broadcast.to(socket.room).emit('updatechat', {userName: 'SERVER', data: `${socket.username} has left this room`})
    socket.room = newroom
    socket.broadcast.to(newroom).emit('updatechat', {userName: 'SERVER', data: `${socket.username} has joined this room`})
  })
  socket.on('sendchat', data => {
    io.sockets.in(socket.room).emit('updatechat', {userName: socket.username, data: data})
  })
  socket.on('disconnect', () => {
    if (socket.room) countPeople[socket.room] --
    delete usernames[socket.username]
    io.sockets.emit('updateusers', countPeople)
    socket.broadcast.emit('updatechat', {userName: 'SERVER', data: `${socket.username} has disconnected`})
    socket.leave(socket.room)
  })
})
app.set('port', (process.env.PORT || 3000))
server.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env)
})
