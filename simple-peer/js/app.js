var inputCallee = document.getElementById('callee')
var btnCall = document.getElementById('btnCall')
var btnHangup = document.getElementById('btnHangup')
var inputCaller = document.getElementById('caller')
var btnLogin = document.getElementById('btnLogin')
var showUser = document.getElementById('showUser')
var localVideo = document.getElementById('localVideo')
var remoteVideo = document.getElementById('remoteVideo')

var p
const pubnub = new PubNub({
  publishKey: 'your keys here',
  subscribeKey: 'your keys here'
})

btnLogin.addEventListener('click', (evt, btn) => {
  showUser.innerText = 'logged in as ' + inputCaller.value

  pubnub.subscribe({
    channels: [inputCaller.value]
  })

  pubnub.addListener({
    message: message => {
      console.log('received', message)
      if (!p) {
        createPeer(false, message.message.caller, () => {
          console.log('answering ', message.message.caller)
          p.signal(message.message.data)
        })
      } else {
        p.signal(message.message.data)
      }
    }
  })

  caller.style.display = 'none'
  btnLogin.style.display = 'none'
  showUser.style.display = 'inline'
  inputCallee.style.display = 'inline'
  btnCall.style.display = 'inline'
})

btnCall.addEventListener('click', (evt, btn) => {
  createPeer(true, inputCallee.value, () => {
    console.log('calling ', inputCallee)
  })
})

btnHangup.addEventListener('click', (evt, btn) => {
  inputCallee.style.display = 'inline'
  btnCall.style.display = 'inline'
  btnHangup.style.display = 'none'

  p.destroy();
  p = null;

  localVideo.src = '';
  remoteVideo.src = '';
})

function createPeer(isInitiator, otherPeer, callback) {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  }).then(stream => {
    inputCallee.style.display = 'none'
    btnCall.style.display = 'none'
    btnHangup.style.display = 'inline'

    localVideo.src = window.URL.createObjectURL(stream)

    p = new SimplePeer({
      initiator: isInitiator,
      stream: stream,
      trickle: false
    })

    p.on('signal', data => {
      console.log('sending:', JSON.stringify(data))
      pubnub.publish({
        channel: otherPeer,
        message: {
          caller: inputCaller.value,
          data: JSON.stringify(data)
        }
      })
    })

    p.on('stream', function (stream) {
      // got remote video stream, now let's show it in a video tag
      remoteVideo.src = window.URL.createObjectURL(stream)
    })

    p.on('close', () => {
      inputCallee.style.display = 'inline'
      btnCall.style.display = 'inline'
      btnHangup.style.display = 'none'
      p = null;
      localVideo.src = '';
      remoteVideo.src = '';
    })

    callback()
  })
}