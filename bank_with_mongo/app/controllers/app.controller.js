const dbConnection = require("../../db/connection");
const Check = require('./validator.controller');

const getUserById = (_id) => {
    return new Promise((resolve, reject) => {
        dbConnection((err, client, db) => {
            if (err) reject(err);
            db.collection('users').findOne({ _id })
                .then(user => {
                    client.close()
                    resolve(user)
                })
                .catch(err => reject(err))
        })
    })
}



class User {
    static getHome(req, res) {
        let noData = true
        try {
            dbConnection((err, client, db) => {
                if (err) res.redirect('/error');
                db.collection('users').find().toArray((error, result) => {
                    let data = result;
                    if (result.length !== 0) noData = false
                    client.close()
                    res.render('home', { pageTitle: 'Home Page', data, noData, home: true })
                })
            })
        } catch (e) {
            res.redirect('/error')
        }
    }
    static getAddUser(req, res) {
        let userData = { name: '', Address: '', phone: '', initalBalance: '' }
        res.render('addUser', { pageTitle: 'Add new User', addUser: true, userData })
    }
    static postAddUser(req, res) {
        dbConnection((err, client, db) => {
            if (err)
                res.send(`Somthing went Error : ${err}`);
            let _id = 5000;
            db.collection('users').find({}).toArray()
                .then(users => {
                    if (users.length != 0) _id = users[users.length - 1]._id + 1
                    let user = { _id, ...req.body, transactions: [{ tranNum: Date.now(), type: 'add', value: +req.body.initalBalance }] }
                    return user
                })
                .then(user => {
                    let userData = req.body;
                    let errors = {}
                    // Start Validation
                    if (Check.checkName(req)) errors.name = Check.checkName(req);
                    if (Check.checkAddress(req)) errors.Address = Check.checkAddress(req)
                    if (Check.checkPhone(req)) errors.phone = Check.checkPhone(req)
                    if (Check.checkinitalBalance(req)) errors.initalBalance = Check.checkinitalBalance(req)
                    // End Validation
                    if (Object.keys(errors).length != 0)
                        return res.render('addUser', { pageTitle: 'Add new User', addUser: true, userData, errors })
                    db.collection('users').insertOne(user).then(_ => {
                        res.redirect('/')
                        client.close()
                    })
                        .catch(err => res.redirect('/error'))
                })
                .catch(err => res.redirect('/error'))
        })
    }
    static getDeleteUser(req, res) {
        let _id = +req.params.id
        dbConnection((err, client, db) => {
            if (err) res.redirect('/error')
            db.collection('users').deleteOne({ _id })
                .then((result) => {
                    client.close()
                    res.redirect('/')
                })
                .catch(err => res.redirect('/error'))
        })
    }
    static getEditUser(req, res) {
        let _id = +req.params.id;
        getUserById(_id)
            .then(data => {
                res.render('editUser', { pageTitle: 'Edit User', data })
            })
            .catch(err => res.send(err))
        // dbConnection((err, client, db) => {
        //     if (err) res.redirect('/error')
        //     db.collection('users').findOne({ _id })
        //         .then(data => {
        //             res.render('editUser', { pageTitle: 'Edit User', data })
        //         })
        //         .catch(err => res.send(err))
        // })
    }


    static postEditUser(req, res) {
        let _id = +req.params.id;
        getUserById(_id).then(data => {
            dbConnection((err, client, db) => {
                let errors = {};
                if (err) res.redirect('/error')
                let userData = req.body
                if (Check.checkName(req)) errors.name = Check.checkName(req);
                if (Check.checkAddress(req)) errors.Address = Check.checkAddress(req)
                if (Check.checkPhone(req)) errors.phone = Check.checkPhone(req)
                if (Object.keys(errors).length != 0)
                    return res.render('editUser', { pageTitle: 'Edit User', errors, userData, data })
                db.collection('users').updateOne({ _id }, { $set: req.body })
                    .then(_ => {
                        res.redirect('/')
                        client.close()
                    })
                    .catch(err => res.send(err))
            })
        })

    }
    static getShowUser(req, res) {
        let _id = +req.params.id
        getUserById(_id).then(data => {
            let noTrans = false
            let sum = 0
            data.transactions.forEach(val => {
                if (val.type == 'add') sum += +val.value
                else sum -= +val.value
            })
            if (data.transactions.length == 0) noTrans = true
            res.render('single', { pageTitle: 'Show User', data, noTrans, sum })
        })
    }

    static getAddTrans(req, res) {
        res.render('addWithDraw', { pageTitle: 'add new Transaction' })
    }


    static postAddTrans(req, res) {
        let _id = +req.params.id
        if (req.body.type == 'add') { var add = true }
        else { var withdraw = true }
        let errors = {};
        if (Check.checkTransValue(req)) errors.trans = { withdraw, add, val: req.body.value, err: Check.checkTransValue(req) }
        console.log(errors);
        if (Object.keys(errors).length != 0)
            return res.render('addWithDraw', { pageTitle: 'Add transaction', errors })

        dbConnection((err, client, db) => {
            db.collection('users').updateOne({ _id }, { $push: { 'transactions': { tranNum: Date.now(), ...req.body } } })
                .then(_ => {
                    res.redirect(`/user/${_id}`)
                    client.close()
                })
                .catch(err => res.send(err))
        })
        // dbConnection((err, client, db) => {
        //     if (err) res.redirect('/error');
        //     db.collection('users').findOne({ _id }).then(user => {
        //         user.transactions.push({ tranNum: Date.now(), ...trans })
        //         return user.transactions
        //     }).then(transactions => {
        //         db.collection('users').updateOne({ _id }, { $set: { transactions } }).then(_ => {
        //             res.redirect(`/user/${_id}`)
        //             client.close()
        //         }).catch(err => res.send(err))
        //     }).catch(err => res.send(err))
        // })

    }

    static getDeleteTransactions(req, res) {
        let _id = +req.params.id
        dbConnection((err, client, db) => {
            if (err) res.redirect('/error')
            db.collection('users').updateOne({ _id }, { $set: { transactions: [] } }).then(_ => {
                res.redirect(`/user/${_id}`)
                client.close()
            }).catch(err => console.log(err))
        })
    }
    static getEditTrans(req, res) {
        let _id = +req.params.id;
        let tranNum = req.params.tranNum;
        dbConnection((err, client, db) => {
            if (err) res.redirect('/error')
            db.collection('users').findOne({ _id })
                .then(user => {
                    let trans = user.transactions.find(trans => trans.tranNum == tranNum)
                    return trans
                }).then(transaction => {
                    if (transaction.type == 'add') { var add = true }
                    else { var withdraw = true }
                    res.render('editTrans', { pageTitle: 'Edit Trans', transaction: transaction.value, add, withdraw })
                })
                .catch(err => res.send(err))
        })
    }

    static postEditTrans(req, res) {
        let _id = +req.params.id;
        let transaction = req.body.value
        let tranNum = +req.params.tranNum;
        if (req.body.type == 'add') { var add = true }
        else { var withdraw = true }
        let errors = {}
        if (Check.checkTransValue(req)) errors.trns = {
            val: req.body.value == '' ? ' ' : req.body.value, err: Check.checkTransValue(req)
        }
        if (Object.keys(errors).length !== 0)
            return res.render('editTrans', { pageTitle: 'Edit Trans', transaction, add, withdraw, errors })

        dbConnection((err, client, db) => {
            if (err) res.redirect('/error')
            db.collection('users').updateOne({ _id, 'transactions.tranNum': tranNum }, {
                $set: {
                    'transactions.$.type': req.body.type,
                    'transactions.$.value': +req.body.value
                }
            }).then(_ => {
                res.redirect(`/user/${_id}`)
                client.close()
            }).catch(err => res.send(err))
        })



    }

    static getDeleteTrans(req, res) {
        let _id = +req.params.id;
        let tranNum = +req.params.tranNum;
        dbConnection((err, client, db) => {
            if (err) res.redirect('/error')
            db.collection('users').updateOne({ _id }, { $pull: { transactions: { tranNum } } })
                .then(_ => {
                    res.redirect(`/user/${_id}`)
                    client.close()
                }).catch(err => res.send(err))
        })
    }
}

module.exports = User