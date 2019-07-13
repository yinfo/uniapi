const path = require('path')
const fs = require('fs')

// const moment = require('moment-timezone')
// const pgDB = require('../models/pgDB')
// const SocketSession = require('../models/SocketSession')
const keys = require('../config/keys')

const $systemSettings = {
    testMode: null,
    sessions: {},
    pingPongCount: 0,

    dynamicModulesPaths: {},
}
module.exports.onStart = async () => {
    this.updateModules()
    if(this.testMode()){
        const json_test = require('../dynamic_modules/json_test')
        // const res = await json_test.createTable()
        // const res = await json_test.initialFill()
        const {rows} = await json_test.getAll()
        console.log(JSON.stringify(rows))
    }
    // console.log(await this.runDynamicModule('Test1', 'test2'))

}

//-------------------------------------------------------------------------------
//---------------------------Динамические модули-----------------------------------------
//--------------------------------------------------------------------------------
module.exports.updateModules = () => {
    const errors = []
    const modelsPath = path.resolve(__dirname, '../dynamic_modules')
    fs.readdirSync(modelsPath).forEach(file => {
        try {

            const fileName = removeExtensionFromFile(file)
            const fullPath = modelsPath + '/' + file

            delete require.cache[require.resolve(fullPath)]
            let temp = require(fullPath)
            $systemSettings.dynamicModulesPaths[fileName] = fullPath

            // console.log('fileName', fileName)
        } catch (e) {
            errors.push('e.message=',e.message)
            console.error(e.message)
        }
    })

    return errors.length > 0 ? errors : null

    function removeExtensionFromFile(file) {
        return file
            .split('.')
            .slice(0, -1)
            .join('.')
            .toString()
    }
}
module.exports.runDynamicModule = async (scr, method, params) => {
    try {
        const fullPath = $systemSettings.dynamicModulesPaths[scr]
        if (fullPath) {
            const result = params ? require(fullPath)[method](params) : require(fullPath)[method]()
            return result
        } else {
            return {errorId: 'wrong_scr_runDynamicModule', message: scr}
        }
    } catch (e) {
        return {errorId: 'error_runDynamicModule', message: e.message}
    }
}
//-------------------------------------------------------------------------------
//---------------------------Разное-----------------------------------------
//--------------------------------------------------------------------------------

module.exports.getSystemInfo = async () => {

    return Object.assign({}, $systemSettings)
    // return {
    //     sessionsCount: Object.keys($systemSettings.sessions).length,
    //     pingPongCount: $systemSettings.pingPongCount
    // }
}
module.exports.getConnectionStringPostgres = function () {
    return keys.connectionStringPostgres
}
module.exports.testMode = function () {
    if($systemSettings.testMode === false){
        return false
    } else if ($systemSettings.testMode === true){
        return true
    } else {
        $systemSettings.testMode = process.env.HOME.indexOf('C:\\Users') > -1
        return  $systemSettings.testMode
    }
}
module.exports.getSystemSettingsByName = (settingsName) => {
    return $systemSettings[settingsName]
}
module.exports.now = function () {

    // if (this.testMode()) {
    //     return moment().add(3, 'hours').startOf('second')
    // } else {
    //     return moment().startOf('second')
    // }
}

//-------------------------------------------------------------------------------
//---------------------------Сессии------------------------------------------
//-------------------------------------------------------------------------------
module.exports.addSession = (ws, sessionId) => {
    // try {
    //     $systemSettings.sessions[sessionId] = new SocketSession(ws, sessionId)
    //     return true
    // } catch (e) {
    //     console.error('addSession', e.message)
    //     return false
    // }
}

module.exports.removeSession = (sessionId) => {
    delete $systemSettings.sessions[sessionId]
}

module.exports.getSession = (sessionId) => {
    return $systemSettings.sessions[sessionId]


}
//-------------------------------------------------------------------------------
//---------------------------Работа с БД------------------------------------------
//-------------------------------------------------------------------------------
module.exports.checkDatabaseSessionId = async (sessionId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!sessionId) reject(false)
//             const result = await pgDB.userCheckSessionId(sessionId)
//             if (result) {
//                 resolve(true)
//             } else {
//                 reject(false)
//             }
//         } catch (e) {
//             console.error(e.message)
//             reject(false)
//         }
//     })
}


