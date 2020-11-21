const path = require('path')
const fs = require('fs')

const $systemSettings = {
  testMode: null,
  sessions: {},
  pingPongCount: 0,
  dynamicModulesPaths: {},
}
module.exports.init = async () => {
  this.updateModules('../test', ['', 'diagnostics', 'index'])

  if (this.testMode()) {


  }
  // console.log(await this.runDynamicModule('Test1', 'test2'))

}

//-------------------------------------------------------------------------------
//---------------------------Динамические модули-----------------------------------------
//--------------------------------------------------------------------------------
module.exports.updateModules = (folder, unloadableFiles) => {
  const errors = []
  const modelsPath = path.resolve(__dirname, folder)
  // const unloadableFiles = ['', 'diagnostics', 'index']
  fs.readdirSync(modelsPath).forEach(file => {
    try {
      const fileName = removeExtensionFromFile(file)

      if (!unloadableFiles.includes(fileName)) {
        console.log(fileName, file)
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
      return params ? require(fullPath)[method](params) : require(fullPath)[method]()
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



