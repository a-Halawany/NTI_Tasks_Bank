const router = require('express').Router();
const appController = require('../controllers/app.controller.js');

// Home
router.get('/', appController.getHome)

// Users
router.get('/addUser', appController.getAddUser)
router.post('/addUser', appController.postAddUser)

router.get('/delete/:id', appController.getDeleteUser)
router.get('/edit/:id', appController.getEditUser)
router.post('/edit/:id', appController.postEditUser)
router.get('/user/:id', appController.getShowUser)

// Transactions
//Add Transaction
router.get('/add-withdraw/:id', appController.getAddTrans)
router.post('/add-withdraw/:id', appController.postAddTrans)
// Edit Transaction
router.get('/editTrans/:id/:tranNum', appController.getEditTrans)
router.post('/editTrans/:id/:tranNum', appController.postEditTrans)
// Delete Transaction
router.get('/deleteTrans/:id/:tranNum', appController.getDeleteTrans)
// Delete All Transactions
router.get('/deleteTransactions/:id', appController.getDeleteTransactions)




module.exports = router