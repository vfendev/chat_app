const rooms = []

// Get active rooms

const addRoom = (room) => {
    // Store rooms 
    const activeRoom = { room }
    rooms.push(activeRoom)
    return {activeRoom}
}

const activeRooms = (room) => {
    return rooms.find((room) => room === room)
}

const add = addRoom('SkTribe')

const active = activeRooms()

console.log(active);