

module.exports = class SocketSession {

    constructor(socket, sessionID) {
        this.timer = null
        this.sessionID = sessionID
        socket.sessionID = sessionID
        this.socket = socket

        //***** TIMER *****
        // setInterval(() => {
        //     const text = $storage.getTestJson()
        //     const textObj = JSON.parse(text)
        //     const text2 = JSON.stringify(textObj)
        // }, 1000)

    }

    stopTimer(){

    }


}


