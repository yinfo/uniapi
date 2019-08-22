const port = process.env.PORT || 8080
const express = require('express')
const app = express()
const session = require('express-session')
const PostgreSqlStore = require('connect-pg-simple')(session);

const sessionParser =session({
    secret: '$eCuRiTy',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: false,
    store: new PostgreSqlStore({
        conString: $storage.getConnectionStringPostgres()
    }),
})
app.use(sessionParser);

const bodyParser = require('body-parser')
app.use(bodyParser.json())
const uuid = require('uuid');
const controller = require('./controllers/uniapi')

app.get('/login', function (req, res) {
    //
    // "Log in" user and set userId to session.
    //
    const id = uuid.v4();
    const user = {name: 'Garry'}

    console.log(`Updating session for user ${id}`);
    req.session.userId = id;
    req.session.user = user;
    res.send({result: 'OK', message: 'Session updated'});
});

// app.delete('/logout', function(request, response) {
//     console.log('Destroying session');
//     request.session.destroy(function() {
//         response.send({ result: 'OK', message: 'Session destroyed' });
//     });
// });

// app.get("/", function (req, res) {
//     if (!req.session.views) {
//         req.session.views = 1;
//     } else {
//         req.session.views += 1;
//     }
//
//     res.json({
//         "status": "ok",
//         "frequency": req.session.views
//     });
// });

app.get('*', function (req, res) {
    res.status(200).json({
        type: 'valid-response',
        message: 'uniapi server work!',
    })
})
app.get('/api', function (req, res) {
    try {
        const errors = $storage.updateModules()
        if (!errors) {
            controller.sendSuccessHttp(res,)
            res.status(200).json({
                type: 'valid-response',
                message: "updateModules success!",
            })
        } else {
            controller.sendErrorHttp(res, 'error_updateModules', e.message)
        }
    } catch (e) {
        controller.sendErrorHttp(res, 'error_updateModules', e.message)
    }
})
app.post('/api', function (req, res) {
    controller.onApiMessageHttp(req, res)
})

const http = require('http')
const WSServer = require('ws').Server

const server = http.createServer(app)
server.on('upgrade', function (request, socket, head) {
    console.log('Parsing session from request...');

    sessionParser(request, {}, () => {
        // console.log('request.session', request.session)
        if (!request.session.userId) {
            console.log('кто-то сунулся в сокеты без request.session.userId')
            socket.destroy();
            return;
        }

        console.log('Session is parsed!');

        wss.handleUpgrade(request, socket, head, function (ws) {
            try {
                wss.emit('connection', ws, request);
            } catch (e) {
                console.log('23423442', e.message)
            }

        });
    });
});
// Create web socket server on top of a regular http server
const wss = new WSServer({
    // server,
    noServer: true,
})
wss.on('connection', function connection(ws, req) {


    controller.sendSuccessWS(ws, `Hy, ${req.session.user.name}!` )
    ws.on('message', function (message) {

        console.log(
            `Received message ${message} from user ${req.session.userId}`
        );
    });
    ws.on('error', (e) => console.log(e.message));
    ws.on('close', () => {
        console.log("closed");
    });
    // console.log('connection req.headers.cookie=',req.headers.cookie)
    // const url_parts = url.parse(req.url, true)
    // if (!url_parts.query || !url_parts.query.session_id){
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
    // }
    // ws.on('message', function incoming(message) {
    // console.log(ws)
    // controller.sendSuccessWS(ws, req.session.views)
    // try {
    //     const command = JSON.parse(message)
    //     controller.onApiMessageWS(ws, command)
    // }
    // catch (e) {
    //     controller.sendErrorWS(ws, 'INCORRECT_JSON_FORMAT',e.message)
    // }
    // })
})

server.listen(port, function () {
    console.log(`http/ws server listening on ${port}`)
})