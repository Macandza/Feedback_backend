const express = require('express')
const router = express.Router()
const logger = require('../logger')

const { 
    getAllUsers,
    //getAllCountries,
    getAllService,
    getAllReport,
    getAllFeed,
    getAllRoles,
    getFinance1,
    getFinance2,
    addCountry,
    addFeed,
    addService,
    addRole,
    addReport,
    updateCountry,
    updateRole,
    updateFeed,
    deleteCountry,
    deleteReport,
    deleteFeed,
    deleteRole,
    deleteUser,
    getTodayReport,
    updateFinance1,    
    upReqSupport,
    updateUserRole,
    addDepartament,
    getAllDepartaments,
    updateDepartament,
    deleteDepartament,
    addTaxes,
    getAllTaxes,
    updateTax,
    deleteTaxes
   
    
 } = require('../controllers/users')

// router.route('/user/login').post(login)
router.route('/user').get(getAllUsers)
router.route('/user/:id').put(updateUserRole)
//router.route('/country').get(getAllCountries).post(addCountry)
router.route('/feedback').get(getAllFeed).post(addFeed)
router.route('/report').get(getAllReport).post(addReport)
router.route('/report').get(getTodayReport)
router.route('/finance1').get(getFinance1)
router.route('/finance1/:id').put(updateFinance1)
router.route('/finance2').get(getFinance2)
router.route('/finance2/:id').put(upReqSupport)
router.route('/service').get(getAllService).post(addService)
router.route('/role').get(getAllRoles).post(addRole)
router.route('/user/:id').delete(deleteUser)
router.route('/country/:id').put(updateCountry).delete(deleteCountry)
router.route('/report/:id').delete(deleteReport)
router.route('/feedback/:id').put(updateFeed).delete(deleteFeed)
//router.route('/report/:id').put(updateService).delete(deleteService)
router.route('/role/:id').put(updateRole).delete(deleteRole)
router.route('/departament').get(getAllDepartaments).post(addDepartament)
router.route('/departament/:id').put(updateDepartament).delete(deleteDepartament)
router.route('/tax').get(getAllTaxes).post(addTaxes)
router.route('/tax/:id').put(updateTax).delete(deleteTaxes)

module.exports = router