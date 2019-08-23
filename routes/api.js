const express = require('express')
const api = require('../controllers/api')
const router = express.Router()

// router.post('/login', api.login)
// router.post('/register', api.register)
// router.post('/logout', api.logout)
// router.post('/ChangeNickName', api.changeNickName)
// router.post('/TutorialCompleted', api.tutorialCompleted)
// router.post('/getChars', api.getChars)
// router.post('/getSelectedPresets', api.getSelectedPresets)
// router.post('/getSpellBook', api.getSpellBook)
// router.post('/SelectedPresets', api.SelectedPresets)
// router.post('/setSettings', api.setSettings)

//404
router.use('*', api.its404)

module.exports = router
