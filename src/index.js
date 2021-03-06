const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');
const { addRoom, getRoom, removeRoom } = require('./utils/rooms');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // Creating unique rooms
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });
        if (error) {
           return callback(error)
        }
        
        socket.join(user.room)

         // Sending message to the new user
        socket.emit('message', generateMessage('Admin', `Welcome ${user.username}!`))

        // Sending message to everyone
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
         
        // Sending users message to other connected users
        io.to(user.room).emit('message', generateMessage(user.username, message))
        
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

         io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    
        callback('Location acknowledged!')
    })

    // Sending message when user leaves chat room
    socket.on('disconnect', () => {
      const user = removeUser(socket.id)

      if (user) {
          
        io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
      }
    })

    socket.on('activeRooms', (room, callback) => {
        room = addRoom(room)
        // console.log(room);
        // console.log(room.newRoom);
        socket.join(room.newRoom)
            io.to(room.newRoom).emit('addingRoom', {
               room: room.newRoom,
               rooms: getRoom(room.newRoom)
            })
           callback()
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})