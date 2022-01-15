const dbConnection = require("../../db/connection");
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
                    db.collection('users').insertOne(user).then(_ => {
                        res.redirect('/')
                        client.close()
                    })
                        .catch(err => res.send(err))
                })
                .catch(err => res.send(err))
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
                .catch(err => console.log(`err => ${err}`))
        })
    }
    static getEditUser(req, res) {
        let _id = +req.params.id;
        dbConnection((err, client, db) => {
            if (err) res.redirect('/error')
            db.collection('users').findOne({ _id })
                .then(data => {
                    res.render('editUser', { pageTitle: 'Edit User', data })
                })
                .catch(err => res.send(err))
        })
    }


    static postEditUser(req, res) {
        let _id = +req.params.id;
        dbConnection((err, client, db) => {
            if (err) res.redirect('/error')
            db.collection('users').updateOne({ _id }, { $set: req.body })
                .then(_ => {
                    res.redirect('/')
                })
                .catch(err => res.send(err))
        })
    }
    static getShowUser(req, res) {
        let _id = +req.params.id
        dbConnection((err, client, db) => {
            if (err) res.redirect('/error')
            db.collection('users').findOne({ _id }).then(data => {
                client.close()
                let noTrans = false
                let sum = 0
                data.transactions.forEach(val => {
                    if (val.type == 'add') sum += +val.value
                    else sum -= +val.value
                })
                if (data.transactions.length == 0) noTrans = true
                res.render('single', { pageTitle: 'Show User', data, noTrans, sum })
            })
        })
    }

    static getAddTrans(req, res) {
        res.render('addWithDraw', { pageTitle: 'add new Transaction' })
    }


    static postAddTrans(req, res) {
        let _id = +req.params.id
        let trans = req.body
        dbConnection((err, client, db) => {
            if (err) res.redirect('/error');
            db.collection('users').findOne({ _id }).then(user => {
                user.transactions.push({ tranNum: Date.now(), ...trans })
                return user.transactions
            }).then(transactions => {
                db.collection('users').updateOne({ _id }, { $set: { transactions } }).then(_ => {
                    res.redirect(`/user/${_id}`)
                    client.close()
                }).catch(err => res.send(err))
            }).catch(err => res.send(err))
        })

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
                    let add = true
                    if (transaction.type == 'withDraw') add = false
                    res.render('editTrans', { pageTitle: 'Edit Trans', transaction, add })
                })
                .catch(err => res.send(err))
        })
    }

    static postEditTrans(req, res) {
        let _id = +req.params.id;
        let tranNum = +req.params.tranNum;
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