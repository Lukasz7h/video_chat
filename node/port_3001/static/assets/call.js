const baseURL = "/"

let localVideo = document.querySelector('#localVideo');
let remoteVideo = document.querySelector('#remoteVideo');

let otherUser;
let remoteRTCMessage;

let iceCandidatesFromCaller = [];
let peerConnection;

let remoteStream;
let localStream;

let callInProgress = false;

function call()
{
    let userToCall = document.getElementById("callName").value;
    otherUser = userToCall;

    beReady()
    .then(bool => {
        processCall(userToCall)
    });
};

function answer()
{
    beReady()
        .then(bool => {
            processAccept();
        })

    document.getElementById("answer").style.display = "none";
};

let pcConfig = {
    "iceServers":
        [
            { "url": "stun:stun.jap.bloggernepal.com:5349" },
            {
                "url": "turn:turn.jap.bloggernepal.com:5349",
                "username": "guest",
                "credential": "somepassword"
            }
        ]
};

// decydujemy z jakich urządzeń chcemy korzystać
let sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

let userName;
let socket;

// tworzymy połącznie z socketem i reagujemy na jego zdarzenia
function connectSocket()
{
    socket = io.connect(baseURL);
    const headerLogin = document.getElementById("userLogin");

    // nasłuchujemy informacje z socketu (w tym przypadku tylko informacje o loginie użytkownika)
    socket.on("message", (data) => {
        data.login? (headerLogin.textContent = "Witaj, "+ data.login +".", userName = data.login) : window.location.href = "http://localhost:4200/";
    });

    // nasłuchujemy czy ktoś do nas dzwoni
    socket.on('newCall', data => {
        otherUser = data.caller;
        remoteRTCMessage = data.rtcMessage

        document.getElementById("callerName").innerHTML = otherUser;
        document.getElementById("call").style.display = "none";
        document.getElementById("answer").style.display = "block";
    })

    // nasłuchujemy czy odpowiedziano na nasze dzwonienie
    socket.on('callAnswered', data => {
        remoteRTCMessage = data.rtcMessage
        peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));

        document.getElementById("calling").style.display = "none";
        callProgress();
    })

    socket.on('ICEcandidate', data => {

        let message = data.rtcMessage

        let candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });

        peerConnection? peerConnection.addIceCandidate(candidate): iceCandidatesFromCaller.push(candidate);
    })

}

// dzwonimy do podanego użytkownika i wysyłamy stream
function sendCall(data)
{ 
    socket.emit("call", data);
    document.getElementById("call").style.display = "none";

    document.getElementById("otherUserNameCA").innerHTML = otherUser;
    document.getElementById("calling").style.display = "block";
};

// odpowiadamy na dzwonienie
function answerCall(data)
{
    socket.emit("answerCall", data);
    callProgress();
};

function sendICEcandidate(data)
{
    socket.emit("ICEcandidate", data);
};

// pobieramy stream z naszych urządzeń (urządzenia audio i video)
function beReady() {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;

        return createConnectionAndAddStream();
    })
    .catch(function (e) {
        alert('getUserMedia() error: ' + e.name);
    });
}

// tworzymy połaczenie rtc i dodajemy do niego stream z naszych lokalnych urządzeń
function createConnectionAndAddStream()
{
    createPeerConnection();
    peerConnection.addStream(localStream);
    return true;
};

// wysyłamy informacje do którego użytkownika chcemy dzwonić
function processCall(userName)
{
    peerConnection.createOffer((sessionDescription) => {
        peerConnection.setLocalDescription(sessionDescription);
        sendCall({
            name: userName,
            rtcMessage: sessionDescription
        })
    }, (error) => {
        console.log("Error");
    });
};

function processAccept()
{
    peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));
    peerConnection.createAnswer((sessionDescription) => {
        peerConnection.setLocalDescription(sessionDescription);

        answerCall({
            caller: otherUser,
            rtcMessage: sessionDescription
        })

    },
    (error) => {
        console.log("Error");
    });
}

// tworzymy połączenie rtc
function createPeerConnection() {
    try
    {
        peerConnection = new RTCPeerConnection(pcConfig);
        peerConnection.onicecandidate = handleIceCandidate;
        
        peerConnection.onaddstream = handleRemoteStreamAdded;
        peerConnection.onremovestream = handleRemoteStreamRemoved;
        return;
    }
    catch(e)
    {
        alert('Nie można stworzyć połączenia RTC.');
        return;
    }
}

function handleIceCandidate(event)
{
    if(event.candidate)
    {
        sendICEcandidate({
            user: otherUser,
            rtcMessage: {
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            }
        });
    };
};

// wyłapujemy stream z naszych lokalnych urządzeń
function handleRemoteStreamAdded(event)
{
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
};

function handleRemoteStreamRemoved()
{
    remoteVideo.srcObject = null;
    localVideo.srcObject = null;
};

// tuż przed odświerzeniem strony przestajemy streamować dane z urządzeń
window.onbeforeunload = function ()
{
    if(callInProgress) stop();
};

// funkcja wyłącza urządzenia od streamu i stylizuje odpowiednie elementy
function stop()
{
    localStream.getTracks().forEach(track => track.stop());
    callInProgress = false;

    peerConnection.close();
    peerConnection = null;

    document.getElementById("call").style.display = "block";
    document.getElementById("answer").style.display = "none";

    document.getElementById("inCall").style.display = "none";
    document.getElementById("calling").style.display = "none";

    document.getElementById("endVideoButton").style.display = "none"
    otherUser = null;
};


// ustawiamy wygląd gdy rozpoczyna się rozmowa
function callProgress()
{
    document.getElementById("videos").style.display = "flex";
    document.getElementById("otherUserName").textContent = otherUser;

    document.getElementById("userLogin").textContent = '';
    document.getElementById("mainHeader").textContent = "Video chat"

    document.getElementById("mainUser").textContent = userName;
    document.getElementById("inCall").style.display = "block";

    callInProgress = true;
};

connectSocket();