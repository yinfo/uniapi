'use strict';
const port = process.env.PORT || 80
const WSServer = require('ws').Server
const server = require('http').createServer()

const httpServer = require('./http-server')
const controller = require('./http-ws-controller')

global.$storage = require('./utils/$storage')
$storage.onStart()

const url = require('url')

// Create web socket server on top of a regular http server
const wss = new WSServer({server: server})

// Also mount the app httpServer here
server.on('request', httpServer)

wss.on('connection', function connection(ws, req) {
    const url_parts = url.parse(req.url, true)
    if (!url_parts.query || !url_parts.query.session_id){
    //     socket.send(JSON.stringify({
    //         'errorId': 'MISSING_SESSION_ID',
    //     }))
    //     socket.close()
    //     return false
    // }
    // if (!socketController.onConnection(socket, url_parts.query.session_id)){
    //     socket.send(JSON.stringify({
    //         'errorId': 'WRONG_SESSION_ID',
    //     }))
    //     socket.close()
    //     return false
    }
    ws.on('message', function incoming(message) {

        try {
            const command = JSON.parse(message)
            controller.onApiMessageWS(ws, command)
        }
        catch (e) {
            ws.send(JSON.stringify({
                'errorId': 'INCORRECT_JSON_FORMAT',
                'msg': e.message,
            }))
        }

        // console.log(`received: ${message}`)
        // ws.send(JSON.stringify({
        //
        //     answer: 50
        // }))
    })
})

server.listen(port, function() {
    console.log(`http/ws server listening on ${port}`)
})





// const WebSocket = require('ws');
//
// const wss = new WebSocket.Server({ port: 80 });
//
// wss.on('connection', function connection(ws) {
//     ws.on('message', function incoming(message) {
//         console.log('received: %s', message)
//         const obj = JSON.parse(message)
//         ws.send('Hello world 2')
//         // ws.send(JSON.stringify({message:obj.data}))
//     });
//
//     ;
// });



// const port = process.env.PORT || 80
// const portSocket = 9002
//
// const express = require('express')
// const app = express()
//
// const jsonServer = require('json-server')
// const router = jsonServer.router('db.json')
//
// const middlewares = jsonServer.defaults()
// app.use('/api', middlewares)
// // To handle POST, PUT and PATCH you need to use a body-parser [Для обработки POST, PUT и PATCH вам нужно использовать body-parser]
// // You can use the one used by JSON Server [Вы можете использовать тот, который используется JSON Server]
// app.use(jsonServer.bodyParser)
// app.use((req, res, next) => {
//     console.log('req.method', req.method)
//     if (req.method === 'VIEW') {
//         // req.body.createdAt = Date.now()
//         req.method = 'GET'
//         console.log('VIEW!!!')
//     }
//     // Continue to JSON Server router
//     next()
// })
// app.use('/api', router)
// app.listen(port)
//
//
// const WebSocketServer = require('./ws_server').Server
// const sockServer = require('http').createServer()
// const wss = new WebSocketServer({server: sockServer})
// wss.on('connection', (socket, req) => {
//

//
//     socket.on('message', (message) => {
//         console.log(message)
//         // try {
//         //     const command = JSON.parse(message)
//         //     socketController.onMessage(socket, command)
//         // } catch (e) {
//         //     socket.send(JSON.stringify({
//         //         'errorId': 'INCORRECT_JSON_FORMAT',
//         //         'msg': e.message,
//         //     }))
//         // }
//     });
//
//     socket.on('close', () => {
//
//
//         // socketController.onClosing(socket)
//     })
//
// })
//
// sockServer.on('request', express())
//
// sockServer.listen(portSocket, () => {
//     console.log(`Socket server on http://localhost:${portSocket}`)
// })
