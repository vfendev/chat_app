const rooms = []

// Get active rooms

const addRoom = ({ room }) => {

    // Clean the data
        room = room.trim().toLowerCase()
        const newRoom = { room }

      // Store rooms 
     
      
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
    return rooms.find((newRoom) => newRoom.room === room)
}


module.exports = {
    addRoom,
    removeRoom,
    getRoom
    
}