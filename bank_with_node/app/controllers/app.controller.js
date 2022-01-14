const fs = require('fs')

const check = require('./validator.controller')

const userHeadr = ['name', 'Address', 'phone'];

const getDataFromJSON = () => {
    let data;
    try {
        data = JSON.parse(fs.readFileSync('./models/users.json'));
        if (!Array.isArray(data)) throw new Error('Array')
    } catch (e) {
        data = []
    }
    return data
}
const writeDataToJSON = (data) => {
    data = JSON.stringify(data)
    fs.writeFileSync('./models/users.json', data)
}

const getSomeData = (req, type = '') => {
    let id = req.params.id
    let data = getDataFromJSON()
    let index = data.findIndex(user => user.id == id);
    let trans;
    let transIndex;
    if (type == 'trans') {
        let tranNum = req.params.tranNum
        transIndex = data[index].transactions.findIndex(tran => tran.tranNum == tranNum)
        trans = data[index].transactions[transIndex]
    }
    else ''
    return { id, data, index, trans, transIndex }
}


class User {
    static getHome(req, res) {
        let data = getDataFromJSON()
        let noData = true
        if (data.length !== 0) noData = false
        res.render('home', { pageTitle: "Home Page", noData, data, home: true })
    }

    static getAddUser(req, res) {
        let errors = {}
        res.render('addUser', {
            pageTitle: 'Add New User', addUser: true,
            userData: { name: '', Address: '', phone: '', initalBalance: '' },
        })
    }

    static postAddUser(req, res) {
        let errors = {};

        if (check.checkName(req)) errors.name = check.checkName(req);
        if (check.checkAddress(req)) errors.Address = check.checkAddress(req)
        if (check.checkPhone(req)) errors.phone = check.checkPhone(req)
        if (check.checkinitalBalance(req)) errors.initalBalance = check.checkinitalBalance(req)

        if (Object.keys(errors).length != 0) {
            console.log(errors)
            res.render('addUser', { pageTitle: 'add', addUser: true, userData: req.body, errors })
        } else {
            let data = getDataFromJSON()
            let id = 5000
            if (data.length != 0) id = data[data.length - 1].id + 1
            let user = {
                id, ...req.body, transactions: [{ tranNum: Date.now(), type: 'add', value: +req.body.initalBalance }]
            }
            data.push(user)
            writeDataToJSON(data)
            res.redirect('/')
        }
    }

    static deleteUser(req, res) {
        let d = getSomeData(req)
        d.data = d.data.filter((u, i) => i != d.index)
        writeDataToJSON(d.data)
        res.redirect('/')
    }

    static getEditUser(req, res) {
        let d = getSomeData(req)
        res.render('editUser', { pageTitle: 'Edit User', data: d.data[d.index] })
    }

    static postEditUser(req, res) {
        let d = getSomeData(req)
        let errors = {};

        if (check.checkName(req)) errors.name = check.checkName(req);
        if (check.checkAddress(req)) errors.Address = check.checkAddress(req)
        if (check.checkPhone(req)) errors.phone = check.checkPhone(req)

        if (Object.keys(errors).length != 0) {
            console.log(errors)
            res.render(`editUser`, { pageTitle: 'Edit User', data: d.data[d.index], userData: req.body, errors })
        } else {
            userHeadr.forEach(el => {
                d.data[d.index][el] = req.body[el]
            })
            writeDataToJSON(d.data)
            res.redirect(`/`)
        }


    }

    static getAddTrans(req, res) {
        res.render('addWithDraw', { pageTitle: 'Add transaction' })
    }

    static postAddTrans(req, res) {
        let d = getSomeData(req)
        d.data[d.index].transactions.push({ tranNum: Date.now(), ...req.body })
        writeDataToJSON(d.data)
        res.redirect('/')
    }

    static getShowSingle(req, res) {
        let d = getSomeData(req)
        let noTrans = true
        if (d.index == -1) return res.redirect('/error')
        if (d.data[d.index].transactions.length != 0) noTrans = false
        let sum = 0
        d.data[d.index].transactions.forEach(v => {
            if (v.type === 'add') sum += +v.value
            else sum -= +v.value
        })
        res.render('single', { pageTitle: d.data[d.index].name, data: d.data[d.index], sum, noTrans })
    }

    static deleteTransactions(req, res) {
        let d = getSomeData(req)
        d.data[d.index].transactions = []
        writeDataToJSON(d.data)
        res.redirect(`/user/${d.id}`)
    }
    static getEditTrans(req, res) {
        let d = getSomeData(req, 'trans')
        let add = d.trans.type == 'add' ? true : false
        res.render('editTrans', { pageTitle: "Edit Transaction", transaction: d.trans, add })
    }

    static postEditTrans(req, res) {
        let d = getSomeData(req, 'trans')
        d.data[d.index].transactions[d.transIndex].type = req.body.type
        d.data[d.index].transactions[d.transIndex].value = req.body.value
        writeDataToJSON(d.data)
        res.redirect(`/user/${d.id}`)
    }

    static getDeleteTrans(req, res) {
        let d = getSomeData(req, 'trans')
        d.data[d.index].transactions = d.data[d.index].transactions.filter((tran, i) => i != d.transIndex)
        writeDataToJSON(d.data)
        res.redirect(`/user/${d.id}`)
    }
}


module.exports = User