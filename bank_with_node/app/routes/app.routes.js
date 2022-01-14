const router = require('express').Router();
const appController = require('../controllers/app.controller')

// Home Page : 
router.get('/', appController.getHome)
// Users : 
router.get('/addUser', appController.getAddUser)
router.post('/addUser', appController.postAddUser)

router.get('/delete/:id', appController.deleteUser)

router.get('/edit/:id', appController.getEditUser)
router.post('/edit/:id', appController.postEditUser)

router.get('/user/:id', appController.getShowSingle)

// Transactions : 
router.get('/add-withdraw/:id', appController.getAddTrans)
router.post('/add-withdraw/:id', appController.postAddTrans)

router.get('/editTrans/:id/:tranNum', appController.getEditTrans)
router.post('/editTrans/:id/:tranNum', appController.postEditTrans)

router.get('/deleteTrans/:id/:tranNum', appController.getDeleteTrans)

router.get('/deleteTransactions/:id', appController.deleteTransactions)




// router.get('*', (req, res) => res.render('error'))

module.exports = router