var inputUri = document.getElementById('uri')
var btnLogin = document.getElementById('btnLogin')
var inputCallee = document.getElementById('callee')
var btnCall = document.getElementById('btnCall')
var localVideo = document.getElementById('localVideo')
var remoteVideo = document.getElementById('remoteVideo')

var domain = "sipjs.onsip.com"
var localUser

btnLogin.addEventListener("click", (btn, evt) => {

    localUser = inputUri.value + getRandr() + '@' + domain;

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

    simple.on('ringing', () => {
        simple.answer()
    })

    btnCall.addEventListener('click', (btn,evt) => {
        simple.call(inputCallee.value)
    })
})

function getRandr() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

