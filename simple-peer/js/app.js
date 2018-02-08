var inputCallee = document.getElementById('callee')
var btnCall = document.getElementById('btnCall')
var btnHangup = document.getElementById('btnHangup')
var localVideo = document.getElementById('localVideo')
var remoteVideo = document.getElementById('remoteVideo')

var p
const pubnub = new PubNub({
  publishKey: 'pub-c-17febd84-2edf-456d-9ab0-72bba81bfd79',
  subscribeKey: 'sub-c-c4a8d352-e17f-11e6-884c-0619f8945a4f'
})

btnCall.addEventListener('click', (evt, btn) => {
  
  pubnub.subscribe({
    channels: [inputCallee.value]
  });

  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(stream => {
      localvideo.src = window.URL.createObjectURL(stream)

      p = new SimplePeer({ initiator: true, stream: stream })

      p.on('signal', data => {
        pubnub.publish({
          channel: inputCallee.value,
          message: data
        })
      })

      p.on('stream', function (stream) {
        // got remote video stream, now let's show it in a video tag
        remotevideo.src = window.URL.createObjectURL(stream)
      })
    })
})

//p.on('error', function (err) { console.log('error', err) })

/*p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
}) */

/* document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault()
  p.signal(JSON.parse(document.querySelector('#incoming').value))
})

p.on('connect', function () {
  console.log('CONNECT')
  p.send('whatever' + Math.random())
})

p.on('data', function (data) {
  console.log('data: ' + data)
}) */