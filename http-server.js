'use strict'

let fs = require('fs')
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
const controller = require('./http-ws-controller')

app.use(bodyParser.json())


// const mainRoute = require('./routes/api')
// app.use('/api', mainRoute)



// Let's create the regular HTTP request and response
app.get('/api', function(req, res) {
    try {
        const errors = $storage.updateModules()
        if(!errors){
            controller.sendSuccessHttp(res,)
            res.status(200).json({
                type: 'valid-response',
                message: "updateModules success!",
            })
        } else {
            controller.sendErrorHttp(res, 'error_updateModules', e.message)
        }
    }catch (e) {
        controller.sendErrorHttp(res, 'error_updateModules', e.message)
    }
})

app.get('*', function(req, res) {

    res.status(200).json({
        type: 'valid-response',
        message: JSON.stringify($storage.getSystemInfo()),
    })
})

app.post('/', function(req, res) {

    controller.onApiMessageHttp(req, res)
    // let message = req.body.message
    // console.log('Regular POST message: ', message)
    // return res.json({
    //     answer: 43
    // })
})

module.exports = app