// const uniqid = require('uniqid')
// const moment = require('moment')
//
// const MODEL_PATH = '../models/'
// const SocketSession = require(MODEL_PATH + 'SocketSession')
//
// const keys = require('../config/keys')
// const {
//     sessionStates,
//     hitStatuses,
//     errorIds,
// } = require('../models/enums')
// const sizeof = require('object-sizeof')
// console.debug('размер сокета ' + sizeof(socket))

module.exports.onConnection = function (socket, sessionId) {


}

module.exports.onMessage = async function (socket, command) {

}

module.exports.onClosing = function (socket) {


}

function sendErr(socket, errorId, msg = null, session = null) {
    // msg = msg ? msg : errorId
    // const uid = socket.__uid
    //
    // try {
    //     const resObj = {uid, errorId, msg}
    //     if (session) {
    //         resObj.state = session.state
    //     }
    //     socket.send(JSON.stringify(resObj))
    // } catch (e) {
    //     console.debug('send_err', e.message)
    // }
    //
    // return false
}

function sendSuccess(socket, command = null, data = {}) {

    // if (!command) command = {scr: '', uid: ''}
    //
    // data.type = "valid-response"
    // if (command.scr)
    //     data.scr = command.scr
    // if (command.uid)
    //     data.uid = command.uid
    //
    // // if(session && command)
    // //     session.history_add(command)
    // if (data.hasOwnProperty('forMain')) delete data.forMain
    //
    // try {
    //     socket.send(JSON.stringify(data))
    // } catch (e) {
    //     //console.error(23823739045793)
    // }
    //
    // return true
}




























