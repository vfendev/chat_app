const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // Creating unique rooms
    socket.on('join', ({ username, room }) => {
        socket.join(room)

         // Sending message to the new user
        socket.emit('message', generateMessage('Welcome!'))

        // Sending message to everyone
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))

        // Sending emits/message to anybody in the room and not the outside
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        // Sending users message to other connected users
        io.to('node.js').emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location acknowledged!')
    })

    // Sending message when user leaves chat room
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})



server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})