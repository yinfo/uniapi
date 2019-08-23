const port = process.env.PORT || 8080
const uuid = require('uuid')
const express = require('express')
const app = express()
const session = require('express-session')
const PostgresSqlStore = require('connect-pg-simple')(session);
const sessionParser =session({
    secret: '$eCuRiTy',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: false,
    store: new PostgresSqlStore({
        conString: $storage.getConnectionStringPostgres()
    }),
})
app.use(sessionParser);

const bodyParser = require('body-parser')
app.use(bodyParser.json())


app.get('/login', function (req, res) {
    //
    // "Log in" user and set userId to session.
    //
    try {
        console.log('app.get(\'/login\'')
        const id = uuid.v4();
        const user = {name: 'Garry'}

        console.log(`Updating session for user ${id}`);
        req.session.userId = id;
        req.session.user = user;
        res.send({result: 'OK', message: 'Session updated'});
    }catch (e) {
        res.send(e);
    }

});
const uniapi = require('./controllers/uniapi')
const mainRoute = require('./routes/api')
app.use('/uniapi', uniapi.onApiMessageHttp)
app.use('/api', mainRoute)



app.all('*', mainRoute) //ловим 404

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
//
// app.get('*', function (req, res) {
//     res.status(200).json({
//         type: 'valid-response',
//         message: 'uniapi server work!',
//     })
// })
// app.get('/api', function (req, res) {
//     try {
//         const errors = $storage.updateModules()
//         if (!errors) {
//             uniapi.sendSuccessHttp(res,)
//             res.status(200).json({
//                 type: 'valid-response',
//                 message: "updateModules success!",
//             })
//         } else {
//             uniapi.sendErrorHttp(res, 'error_updateModules', e.message)
//         }
//     } catch (e) {
//         uniapi.sendErrorHttp(res, 'error_updateModules', e.message)
//     }
// })
//
//

const WSServer = require('ws').Server
const server = require('http').createServer(app)
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
    console.log('connection!!!')
    uniapi.sendSuccessWS(ws, `Hy, ${req.session.user.name}!` )
    ws.on('message', function (message) {
        uniapi.onApiMessageWS(ws, message)
    });
    ws.on('error', (e) => console.log(e.message));
    ws.on('close', () => {
        console.log("closed");
    });
})

server.listen(port, function () {
    console.log(`http/ws server listening on ${port}`)
})