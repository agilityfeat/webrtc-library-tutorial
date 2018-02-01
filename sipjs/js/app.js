var inputUri = document.getElementById('uri')
var btnLogin = document.getElementById('btnLogin')
var inputCallee = document.getElementById('callee')
var btnCall = document.getElementById('btnCall')
var localVideo = document.getElementById('localVideo')
var remoteVideo = document.getElementById('remoteVideo')
var btnHangup = document.getElementById('btnHangup')
var showUser = document.getElementById('showUser')

var domain = "sipjs.onsip.com"
var localUser

btnLogin.addEventListener("click", (btn, evt) => {

    localUser = inputUri.value + getRandr() + '@' + domain

    var configuration = {
        media: {
            local: {
                video: localVideo
            },
            remote: {
                video: remoteVideo,
                audio: remoteVideo
            }
        },
        ua: {
            traceSip: true,
            uri: localUser,
            displayName: inputUri.value,
        }
    }

    var simple = new SIP.WebRTC.Simple(configuration)

    simple.on('registered', () => {

        showUser.innerText = 'Logged in as ' + localUser
        showUser.style.display = 'inline'
        inputUri.style.display = 'none'
        btnLogin.style.display = 'none'
        inputCallee.style.display = 'inline'
        btnCall.style.display = 'inline'

        simple.on('ringing', () => {
            simple.answer()
            inputCallee.style.display = 'none'
            btnCall.style.display = 'none'
            btnHangup.style.display = 'inline'
        })

        simple.on('ended', () => {
            inputCallee.style.display = 'inline'
            btnCall.style.display = 'inline'
            btnHangup.style.display = 'none'
        })
    
        btnCall.addEventListener('click', (btn,evt) => {
            simple.call(inputCallee.value)
            inputCallee.style.display = 'none'
            btnCall.style.display = 'none'
            btnHangup.style.display = 'inline'
        })
    
        btnHangup.addEventListener('click', (btn,evt) => {
            simple.hangup()
            inputCallee.style.display = 'inline'
            btnCall.style.display = 'inline'
            btnHangup.style.display = 'none'
        })
    })
})

function getRandr() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

