
// Template

const dropdownTemplate = document.querySelector('#active-dropdown')

// Options

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('activeRooms', ({ rooms }) => {
    const html = Mustache.render(dropdownTemplate, {
        rooms
    })
    document.querySelector('#active_rooms').innerHTML = html
})