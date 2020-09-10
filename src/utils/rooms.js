const rooms = []

// Get active rooms

const addRoom = (room) => {

    // Clean the data
        room = room.trim().toLowerCase()
        const newRoom =  {room}

        //  Check for existing rooms
        const existingRoom = rooms.find((newRoom) => {
        return newRoom.room === room
    })

    // Validate roomname
    if (existingRoom) {
        return {
            error: 'Room is in use!'
        }
    }

    // Store rooms 
    rooms.push(newRoom)
    return { newRoom }
    
}

// Remove room
const removeRoom = (room) => {
    const index = rooms.findIndex((newRoom) => newRoom.room === room)
        if (index !== -1) {
            return rooms.splice(index, 1)[0]
        }
   
}

// Get room
const getRoom = (room) => {
    room = room.trim().toLowerCase()
    return rooms.find((newRoom) => newRoom.room === room)
}

// console.log(addRoom('Tribe'));
// console.log(addRoom('running'));
// console.log(addRoom('test'));
// console.log(rooms);
// console.log('Printing active room');
// console.log(getRoom('Running'));

module.exports = {
    addRoom,
    removeRoom,
    getRoom
    
}