const port = process.env.PORT || 8080
const uuid = require('uuid')
const express = require('express')
const app = express()
/*const session = require('express-session')
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
app.use(sessionParser);*/

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const uniapi = require('./uniapi')
//const mainRoute = require('./routes/api')
app.use('/api', uniapi.onApiMessageHttp)
//app.use('/api', mainRoute)
//app.all('*', mainRoute) //ловим 404
app.all('*', (req, res) =>{
    res.status(404).json({
        success: false,
        data: '404'
    })
})

const WSServer = require('ws').Server
const server = require('http').createServer(app)
/*server.on('upgrade', function (request, socket, head) {
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
});*/
// Create web socket server on top of a regular http server
const wss = new WSServer({
     server,
    noServer: true,
})
wss.on('connection', function connection(ws, req) {
    console.log('connection!!!')
    //uniapi.sendSuccessWS(ws, `Hy from server!` )
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
