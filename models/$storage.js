const path = require('path')
const fs = require('fs')
const {db} = require('../db_pgp');
const Users = require('../db_pgp/db_users');
const db_users = new Users(db)
// const db_users = new require('../db_pgp/db_users')(db)

// const moment = require('moment-timezone')
// const pgDB = require('../models/pgDB')
// const SocketSession = require('../models/SocketSession')

const $systemSettings = {
    testMode: null,
    sessions: {},
    pingPongCount: 0,

    dynamicModulesPaths: {},
}
module.exports.onStart = async () => {
     this.updateModules()
    if (this.testMode()) {



        console.log(await db_users.all())

        // db.any('SELECT * FROM users', null)
        //     .then(function(data) {
        //         console.log('data',data)
        //     })
        //     .catch(function(error) {
        //         // error;
        //     });
        // const session = require('../db_pg/session')
        // console.log(await session.getAll().rows)

        // const json_test = require('../db/json_test')
        // const res = await json_test.createTable()
        // const res = await json_test.initialFill()
        // const {rows} = await json_test.getAll()
        // console.log(JSON.stringify(rows))
    }
    // console.log(await this.runDynamicModule('Test1', 'test2'))

}

//-------------------------------------------------------------------------------
//---------------------------Динамические модули-----------------------------------------
//--------------------------------------------------------------------------------
module.exports.updateModules = () => {
    const errors = []
    const modelsPath = path.resolve(__dirname, '../db_pgp')
    const unloadableFiles = ['', 'diagnostics', 'errors', 'index']
    fs.readdirSync(modelsPath).forEach(file => {
        try {
            const fileName = removeExtensionFromFile(file)
            if(!unloadableFiles.includes(fileName) ){
                console.log('fileName', fileName)
                const fullPath = modelsPath + '/' + file
                delete require.cache[require.resolve(fullPath)]
                let temp = require(fullPath)
                $systemSettings.dynamicModulesPaths[fileName] = fullPath
            }
        } catch (e) {
            errors.push('e.message=', e.message)
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
    let dbConfig = process.env.postgresString
    if(process.env.NODE_ENV === 'production'){
        dbConfig =process.env.postgresString
    } else {
        dbConfig = require('../local_keys').postgresString
    }
    return dbConfig
    // return  process.env.NODE_ENV === 'production'? process.env.postgresString: require('../local_keys').postgresString

    // if (this.testMode()) {
    //     return require('../local_keys').postgresString
    // } else {
    //     return process.env.postgresString
    // }
}
module.exports.testMode = function () {

    if ($systemSettings.testMode === false) {
        return false
    } else if ($systemSettings.testMode === true) {
        return true
    } else {
        $systemSettings.testMode = process.env.HOME.indexOf('C:\\Users') > -1
        return $systemSettings.testMode
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


