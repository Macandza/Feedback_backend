const express = require('express')
const { login, register, reset, passwordReset,getAllCountries } = require('../controllers/auth')
const router = require('./users')
const Router = express.Router()
const logger = require('../logger')

router.post('/register', register)
router.post('/login', login)
router.post('/reset-pin', reset)   
router.post('/password-reset', passwordReset) 
router.post(`/password-reset-link`)
router.get('/country',getAllCountries)

module.exports = router