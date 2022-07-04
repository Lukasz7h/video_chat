const { Server } = require('socket.io');
let IO;

const { getJwt } = require("../jwt.cjs");
const users = {};

module.exports.initIO = (httpServer) => {

    IO = new Server(httpServer);

    IO.use((socket, next) => next())

    IO.on('connection', async (socket) => {

        const userDataFromJwt = await getJwt(socket.handshake, null, true);
        if(!userDataFromJwt || !userDataFromJwt.login){
            
            socket.emit("message", false);
            return;
        }

        // jeśli jest to nowy użytkownik dodajemy go do istniejących użytkowników
        if(!users[`${userDataFromJwt.login}`] && userDataFromJwt.login != undefined)
        {
            var user = userDataFromJwt.login;
            Object.defineProperty(users, `${userDataFromJwt.login}`, {
                value: {
                    socket
                },
                enumerable: true
            });
        }
        else{
            var user = userDataFromJwt.login;
            users[`${userDataFromJwt.login}`].socket = socket;
        };

        socket.emit("message", {login: userDataFromJwt.login});
        socket.join(userDataFromJwt.login);

        // jeden z użytkowników zdecydował się zadzwonić do innego
        socket.on('call', (data) => {

            let callee = data.name;
            let rtcMessage = data.rtcMessage;

            if(users[`${callee}`])
            {
                users[`${callee}`].socket
                .emit("newCall", {
                    caller: user,
                    rtcMessage: rtcMessage
                });
            };
        })

        // użytkownik odpowiedział na dzwonienie
        socket.on('answerCall', (data) => {
            let caller = data.caller;
            rtcMessage = data.rtcMessage

            socket.to(caller).emit("callAnswered", {
                callee: user,
                rtcMessage: rtcMessage
            })

        })

        socket.on('ICEcandidate', (data) => {
            let otherUser = data.user;
            let rtcMessage = data.rtcMessage;

            socket.to(otherUser).emit("ICEcandidate", {
                sender: socket.user,
                rtcMessage: rtcMessage
            })
        })
    })
}

module.exports.getIO = () => {
    if (!IO) {
        throw Error("IO not initilized.")
    } else {
        return IO;
    }
}