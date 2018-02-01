var inputCallee = document.getElementById('callee')
var btnCall = document.getElementById('btnCall')
var btnHangup = document.getElementById('btnHangup')

var session = null
const number = ('' + Math.random() * 100000).split('.')[0]
document.getElementById('my-number').innerHTML = number

var phone = PHONE({
    number: number,
    publish_key: 'pub-c-17febd84-2edf-456d-9ab0-72bba81bfd79',
    subscribe_key: 'sub-c-c4a8d352-e17f-11e6-884c-0619f8945a4f',
    media: {
        audio: true,
        video: true
    },
    ssl: true
})

phone.ready(function () {
    console.log('Phone is ready')
})

phone.camera.ready(function (video) {
    console.log('Camera is ready', video)
    phone.$('call').append(video)
})

phone.receive(function (session) {
    console.log('Receiving call from Friend!')
    session.connected(function (session) {
        // Display Your Friend's Live Video
        console.log("Showing your friend's video stream")
        inputCallee.style.display = 'none'
        btnCall.style.display = 'none'
        btnHangup.style.display = 'inline'
        phone.$('call').appendChild(session.video)
    })
    session.ended(session => {
        sessions.hangup()
        inputCallee.style.display = 'inline'
        btnCall.style.display = 'inline'
        btnHangup.style.display = 'none'
    })
})

btnCall.addEventListener('click', (btn, evt) => {
    var callee = inputCallee.value
    console.log('calling ' + callee)
    session = phone.dial(callee)
    inputCallee.style.display = 'none'
    btnCall.style.display = 'none'
    btnHangup.style.display = 'inline'
})

btnHangup.addEventListener('click', (btn,evt) => {
    phone.hangup()
    inputCallee.style.display = 'inline'
    btnCall.style.display = 'inline'
    btnHangup.style.display = 'none'
})