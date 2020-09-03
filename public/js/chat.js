const socket = io()

// Elements

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#btn-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

// Server

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    })

    socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationTemplate, {
        url: url.url,
        createdAt: moment(url.createdAt).format('H:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

    // Client

    $messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disable form
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {

    //Enable form   
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    })
})

    $sendLocation.addEventListener('click', () => {
        if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
        } 

        // Disable button
        $sendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (msg) => {
            console.log('Location shared!', msg)

            // Enable button
            $sendLocation.removeAttribute('disabled')
        })
    })
   
})